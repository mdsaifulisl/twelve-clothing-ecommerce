import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
import { toMoneyString } from '../utils/order-money.util.js';
import { getSocketPeerIp } from '../utils/ip-address.util.js';
import { getFullImageUrl } from '../utils/getImageUrl.js';
import {
  archiveOrder,
  createOrder,
  getOrderById,
  listOrders,
  lookupOrder,
  markOrderSeen,
  unarchiveOrder,
  updateOrderStatus,
  type AuditActor,
  type OrderWithItems,
} from '../services/order.service.js';
import {
  orderIdSchema,
  ordersQuerySchema,
  type ArchiveOrderInput,
  type CreateOrderInput,
  type OrderLookupInput,
  type UpdateOrderStatusInput,
} from '../validations/order.validation.js';

const publicOrderResponse = (order: OrderWithItems, includeCustomer: boolean) => ({
  orderCode: order.orderCode,
  status: order.status,
  ...(includeCustomer
    ? {
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        city: order.city,
      }
    : {}),
  paymentMethod: order.paymentMethod,
  subtotal: toMoneyString(order.subtotal),
  deliveryCharge: toMoneyString(order.deliveryCharge),
  totalAmount: toMoneyString(order.totalAmount),
  createdAt: order.createdAt,
  items: order.items.map((item) => ({
    title: item.productTitle,
    sku: item.sku,
    size: item.size,
    color: item.color,
    unitPrice: toMoneyString(item.unitPrice),
    quantity: item.quantity,
    lineTotal: toMoneyString(item.lineTotal),
  })),
});

const sellerOrderResponse = (req: Request, order: OrderWithItems) => ({
  id: order.id,
  orderCode: order.orderCode,
  customerName: order.customerName,
  phone: order.phone,
  address: order.address,
  city: order.city,
  paymentMethod: order.paymentMethod,
  status: order.status,
  subtotal: toMoneyString(order.subtotal),
  deliveryCharge: toMoneyString(order.deliveryCharge),
  totalAmount: toMoneyString(order.totalAmount),
  clientIp: order.clientIp,
  deviceFingerprint: order.deviceFingerprint,
  seenAt: order.seenAt,
  seenBy: order.seenBy,
  archivedAt: order.archivedAt,
  archivedBy: order.archivedBy,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    image: (() => {
      const images = item.product?.image;
      const firstImage = Array.isArray(images) ? images.find((image): image is string => typeof image === 'string') : undefined;
      return firstImage ? getFullImageUrl(req, firstImage) : null;
    })(),
    title: item.productTitle,
    sku: item.sku,
    size: item.size,
    color: item.color,
    unitPrice: toMoneyString(item.unitPrice),
    quantity: item.quantity,
    lineTotal: toMoneyString(item.lineTotal),
  })),
});

const parseOrderId = (value: string | string[]) => {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = orderIdSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400, parsed.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })));
  }
  return parsed.data;
};

const requireSellerIdentity = (res: Response): AuditActor => {
  const seller = res.locals.sellerUser as { id?: string; name?: string } | undefined;
  if (!seller?.id) {
    throw new AppError('Seller authentication is not configured', 503);
  }
  return {
    actorId: seller.id,
    actorLabel: seller.name ?? null,
  };
};

const publicOperationError = (error: unknown, fallback: string): AppError =>
  error instanceof AppError ? error : new AppError(fallback, 500);

export const createOrderHandler = async (req: Request, res: Response) => {
  try {
    const requestIp = getSocketPeerIp(req);
    if (!requestIp) throw new AppError('Unable to determine request IP', 503);
    const order = await createOrder(req.body as CreateOrderInput, requestIp);
    return res.status(201).json({
      success: true,
      data: publicOrderResponse(order, false),
    });
  } catch (error) {
    throw publicOperationError(error, 'Unable to place order');
  }
};

export const lookupOrderHandler = async (req: Request, res: Response) => {
  try {
    const order = await lookupOrder(req.body as OrderLookupInput);
    return res.status(200).json({
      success: true,
      data: publicOrderResponse(order, true),
    });
  } catch (error) {
    throw publicOperationError(error, 'Unable to look up order');
  }
};

export const listOrdersHandler = async (req: Request, res: Response) => {
  requireSellerIdentity(res);
  const result = await listOrders(res.locals.validatedOrdersQuery);
  return res.status(200).json({
    success: true,
    count: result.total,
    data: result.data.map((order) => sellerOrderResponse(req, order)),
    pagination: {
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
  });
};

export const getOrderByIdHandler = async (req: Request, res: Response) => {
  requireSellerIdentity(res);
  const id = parseOrderId(req.params.id);
  const order = await getOrderById(id);
  return res.status(200).json({ success: true, data: sellerOrderResponse(req, order) });
};

export const updateOrderStatusHandler = async (req: Request, res: Response) => {
  const actor = requireSellerIdentity(res);
  actor.requestIp = req.ip;
  const id = parseOrderId(req.params.id);
  const order = await updateOrderStatus(id, req.body as UpdateOrderStatusInput, actor);
  return res.status(200).json({ success: true, data: sellerOrderResponse(req, order) });
};

export const archiveOrderHandler = async (req: Request, res: Response) => {
  const actor = requireSellerIdentity(res);
  actor.requestIp = req.ip;
  const id = parseOrderId(req.params.id);
  const input = req.body as ArchiveOrderInput;
  const order = input.archived
    ? await archiveOrder(id, actor)
    : await unarchiveOrder(id, actor);
  return res.status(200).json({ success: true, data: sellerOrderResponse(req, order) });
};

export const markOrderSeenHandler = async (req: Request, res: Response) => {
  const actor = requireSellerIdentity(res);
  actor.requestIp = req.ip;
  const id = parseOrderId(req.params.id);
  const order = await markOrderSeen(id, actor);
  return res.status(200).json({ success: true, data: sellerOrderResponse(req, order) });
};

export const validateOrdersQuery = (req: Request, res: Response, next: (error?: unknown) => void) => {
  try {
    res.locals.validatedOrdersQuery = ordersQuerySchema.parse(req.query);
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new AppError('Validation failed', 400, error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }))));
    }
    return next(error);
  }
};

