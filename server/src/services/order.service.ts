import { randomBytes, timingSafeEqual, createHash } from 'crypto';
import { OrderAuditAction, Prisma } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';
import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import type { CanonicalIpAddress } from '../utils/ip-address.util.js';
import { findOrCreateCustomerForOrder } from './customer.service.js';
import { notifyTelegramNewOrder } from './telegram.service.js';
import {
  assertOrderMoneyFits,
  calculateDeliveryCharge,
  calculateOrderItemPrice,
} from '../utils/order-money.util.js';
import type {
  ArchiveOrderInput,
  CreateOrderInput,
  OrderLookupInput,
  OrdersQuery,
  UpdateOrderStatusInput,
} from '../validations/order.validation.js';

const orderWithItems = {
  items: {
    orderBy: { createdAt: 'asc' as const },
    include: { product: { select: { image: true } } },
  },
};

const typedPrisma = prisma as unknown as PrismaClient;

export type OrderWithItems = Prisma.OrderGetPayload<{ include: typeof orderWithItems }>;

export interface AuditActor {
  actorId?: string | null;
  actorLabel?: string | null;
  requestIp?: string | null;
}

const createOrderCode = (): string => `RK-${randomBytes(12).toString('hex').toUpperCase()}`;

const isUniqueConflict = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

const getProductSizeOptions = (value: Prisma.JsonValue): string[] | null => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) return null;
  return value as string[];
};

const validateProductOptions = (
  product: { availableSizes: Prisma.JsonValue; color: string | null },
  selected: { size: string; color: string },
) => {
  const sizes = getProductSizeOptions(product.availableSizes);
  if (!sizes) {
    throw new AppError('Product options are not configured for ordering', 409);
  }

  const isValidSize = sizes.length === 0
    ? selected.size === 'Free Size'
    : sizes.includes(selected.size);

  if (!isValidSize) {
    throw new AppError('Selected size is not available for this product', 400);
  }

  const selectedColor = selected.color.trim();
  if (product.color) {
    if (!selectedColor || selectedColor.toLocaleLowerCase() !== product.color.trim().toLocaleLowerCase()) {
      throw new AppError('Selected color does not match this product', 400);
    }
  } else if (selectedColor) {
    throw new AppError('This product does not have a selectable color', 400);
  }
};

export const createOrder = async (input: CreateOrderInput, requestIp: CanonicalIpAddress) => {
  const maxCollisionRetries = 3;
  const deviceFingerprint = input.deviceId
    ? createHash('sha256').update(input.deviceId.toLowerCase()).digest('hex')
    : null;

  for (let attempt = 0; attempt <= maxCollisionRetries; attempt += 1) {
    const orderCode = createOrderCode();

    try {
      const createdOrder = await typedPrisma.$transaction(async (tx) => {
        const customer = await findOrCreateCustomerForOrder(tx, input, requestIp, deviceFingerprint);
        const productIds = [...new Set(input.items.map((item) => item.productId))];
        const products = await tx.product.findMany({ where: { id: { in: productIds } } });
        const productById = new Map(products.map((product) => [product.id, product]));

        const preparedItems = input.items.map((item) => {
          const product = productById.get(item.productId);
          if (!product) {
            throw new AppError('One or more products are not available for ordering', 400);
          }

          validateProductOptions(product, item);
          const { unitPrice, lineTotal } = calculateOrderItemPrice(product, item.quantity);
          return {
            productId: product.id,
            productTitle: product.title,
            sku: product.sku,
            size: item.size,
            color: product.color,
            unitPrice,
            quantity: item.quantity,
            lineTotal,
          };
        });

        const subtotal = assertOrderMoneyFits(preparedItems.reduce(
          (total, item) => total.plus(item.lineTotal),
          new Prisma.Decimal('0.00'),
        ));
        const settingsClient = tx as unknown as {
          storeSettings: {
            findUnique: (args: {
              where: { id: string };
              select: { delivery: true; payment: true };
            }) => Promise<{ delivery: Prisma.JsonValue; payment: Prisma.JsonValue } | null>;
          };
        };
        const settings = await settingsClient.storeSettings.findUnique({
          where: { id: 'singleton' },
          select: { delivery: true, payment: true },
        });
        const delivery = settings?.delivery && typeof settings.delivery === 'object' && !Array.isArray(settings.delivery)
          ? settings.delivery as { insideDhakaCharge?: number; outsideDhakaCharge?: number; freeDeliveryThreshold?: number }
          : undefined;
        const deliveryCharge = calculateDeliveryCharge(input.city, subtotal, delivery);
        const payment = settings?.payment && typeof settings.payment === 'object' && !Array.isArray(settings.payment)
          ? settings.payment as { codEnabled?: boolean; bkashEnabled?: boolean }
          : undefined;
        const selectedMethodEnabled = input.paymentMethod === 'cod'
          ? payment?.codEnabled !== false
          : payment?.bkashEnabled !== false;
        if (!selectedMethodEnabled) {
          throw new AppError('The selected payment method is currently unavailable', 409);
        }
        const totalAmount = assertOrderMoneyFits(
          subtotal.plus(deliveryCharge).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP),
        );

        const order = await tx.order.create({
          data: {
            orderCode,
            customerName: input.customerName,
            phone: input.phone,
            normalizedPhone: input.normalizedPhone,
            customerId: customer.id,
            address: input.address,
            city: input.city,
            paymentMethod: input.paymentMethod,
            subtotal,
            deliveryCharge,
            totalAmount,
            clientIp: requestIp.address,
            deviceFingerprint,
            items: { create: preparedItems },
          },
          include: orderWithItems,
        });

        await tx.orderAuditLog.create({
          data: {
            orderId: order.id,
            action: OrderAuditAction.ORDER_CREATED,
            requestIp: requestIp.address,
            newValue: {
              orderCode: order.orderCode,
              status: order.status,
              paymentMethod: order.paymentMethod,
            },
          },
        });

        return order;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      await notifyTelegramNewOrder(createdOrder);
      return createdOrder;
    } catch (error) {
      const retryableConflict = isUniqueConflict(error)
        || (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034');
      if (retryableConflict && attempt < maxCollisionRetries) continue;
      if (retryableConflict) {
        throw new AppError('Unable to create order at this time. Please retry.', 503);
      }
      throw error;
    }
  }

  throw new AppError('Unable to create order at this time. Please retry.', 503);
};

export const lookupOrder = async (input: OrderLookupInput) => {
  const order = await typedPrisma.order.findUnique({
    where: { orderCode: input.orderCode },
    include: orderWithItems,
  });

  const requestedDigest = createHash('sha256').update(input.normalizedPhone).digest();
  const storedDigest = createHash('sha256').update(order?.normalizedPhone ?? 'no-matching-order').digest();
  const phoneMatches = timingSafeEqual(requestedDigest, storedDigest);

  if (!order || !phoneMatches) {
    throw new AppError('Order not found or details do not match', 404);
  }

  return order;
};

export const listOrders = async (query: OrdersQuery) => {
  const where: Prisma.OrderWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.archived === 'all'
      ? {}
      : { archivedAt: query.archived === 'true' ? { not: null } : null }),
  };

  if (query.search) {
    where.OR = [
      { orderCode: { contains: query.search } },
      { customerName: { contains: query.search } },
      { phone: { contains: query.search } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [total, data] = await typedPrisma.$transaction([
    typedPrisma.order.count({ where }),
    typedPrisma.order.findMany({
      where,
      include: orderWithItems,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.limit,
    }),
  ]);

  return {
    total,
    data,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
  };
};

export const getOrderById = async (id: string) => {
  const order = await typedPrisma.order.findUnique({ where: { id }, include: orderWithItems });
  if (!order) throw new AppError('Order not found', 404);
  return order;
};

export const updateOrderStatus = async (
  id: string,
  input: UpdateOrderStatusInput,
  actor: AuditActor,
) => typedPrisma.$transaction(async (tx) => {
  const current = await tx.order.findUnique({ where: { id } });
  if (!current) throw new AppError('Order not found', 404);

  if (current.status !== input.status) {
    const updated = await tx.order.update({ where: { id }, data: { status: input.status } });
    await tx.orderAuditLog.create({
      data: {
        orderId: id,
        action: OrderAuditAction.STATUS_CHANGED,
        actorId: actor.actorId ?? null,
        actorLabel: actor.actorLabel ?? null,
        requestIp: actor.requestIp?.slice(0, 45) || null,
        oldValue: { status: current.status },
        newValue: { status: updated.status },
      },
    });
  }

  return getOrderByIdWithinTransaction(tx, id);
});

const getOrderByIdWithinTransaction = async (tx: Prisma.TransactionClient, id: string) => {
  const order = await tx.order.findUnique({ where: { id }, include: orderWithItems });
  if (!order) throw new AppError('Order not found', 404);
  return order;
};

const setOrderArchived = async (
  id: string,
  archived: boolean,
  actor: AuditActor,
) => typedPrisma.$transaction(async (tx) => {
  const current = await tx.order.findUnique({ where: { id } });
  if (!current) throw new AppError('Order not found', 404);

  const currentlyArchived = current.archivedAt !== null;
  if (currentlyArchived !== archived) {
    const updated = await tx.order.update({
      where: { id },
      data: archived
        ? { archivedAt: new Date(), archivedBy: actor.actorId ?? actor.actorLabel ?? null }
        : { archivedAt: null, archivedBy: null },
    });
    await tx.orderAuditLog.create({
      data: {
        orderId: id,
        action: archived ? OrderAuditAction.ARCHIVED : OrderAuditAction.UNARCHIVED,
        actorId: actor.actorId ?? null,
        actorLabel: actor.actorLabel ?? null,
        requestIp: actor.requestIp?.slice(0, 45) || null,
        oldValue: {
          archivedAt: current.archivedAt?.toISOString() ?? null,
          archivedBy: current.archivedBy,
        },
        newValue: {
          archivedAt: updated.archivedAt?.toISOString() ?? null,
          archivedBy: updated.archivedBy,
        },
      },
    });
  }

  return getOrderByIdWithinTransaction(tx, id);
});

export const archiveOrder = (id: string, actor: AuditActor) =>
  setOrderArchived(id, true, actor);

export const unarchiveOrder = (id: string, actor: AuditActor) =>
  setOrderArchived(id, false, actor);

export const markOrderSeen = async (id: string, actor: AuditActor) =>
  typedPrisma.$transaction(async (tx) => {
    const current = await tx.order.findUnique({ where: { id } });
    if (!current) throw new AppError('Order not found', 404);

    if (!current.seenAt) {
      const seenAt = new Date();
      await tx.order.update({
        where: { id },
        data: {
          seenAt,
          seenBy: actor.actorId ?? actor.actorLabel ?? null,
        },
      });
      await tx.orderAuditLog.create({
        data: {
          orderId: id,
          action: OrderAuditAction.SEEN,
          actorId: actor.actorId ?? null,
          actorLabel: actor.actorLabel ?? null,
          requestIp: actor.requestIp?.slice(0, 45) || null,
          oldValue: { seenAt: null, seenBy: null },
          newValue: { seenAt: seenAt.toISOString(), seenBy: actor.actorId ?? actor.actorLabel ?? null },
        },
      });
    }

    return getOrderByIdWithinTransaction(tx, id);
  });
