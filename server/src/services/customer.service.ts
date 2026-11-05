import { Prisma, SecurityAuditAction, SecurityAuditTargetType } from '@prisma/client';
import type { PrismaClient, Prisma as PrismaTypes } from '@prisma/client';
import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import type { CanonicalIpAddress } from '../utils/ip-address.util.js';
import type {
  BlockedIpListQuery,
  BlockIpInput,
  CustomerBlockInput,
  CustomerDetailQuery,
  CustomerListQuery,
} from '../validations/customer.validation.js';
import type { CreateOrderInput } from '../validations/order.validation.js';

const typedPrisma = prisma as unknown as PrismaClient;

export interface ManagementActor {
  actorId?: string | null;
  actorLabel?: string | null;
  requestIp?: string | null;
}

const writeSecurityAudit = async (
  tx: PrismaTypes.TransactionClient,
  input: {
    targetType: SecurityAuditTargetType;
    targetId: string;
    action: SecurityAuditAction;
    actor: ManagementActor;
    requestIp?: string | null;
    oldValue?: Prisma.InputJsonValue;
    newValue?: Prisma.InputJsonValue;
  },
) => tx.securityAuditLog.create({
  data: {
    targetType: input.targetType,
    targetId: input.targetId,
    action: input.action,
    actorId: input.actor.actorId ?? null,
    actorLabel: input.actor.actorLabel ?? null,
    requestIp: input.requestIp?.slice(0, 45) || input.actor.requestIp?.slice(0, 45) || null,
    ...(input.oldValue !== undefined ? { oldValue: input.oldValue } : {}),
    ...(input.newValue !== undefined ? { newValue: input.newValue } : {}),
  },
});

/** Checks both blocks and creates/reuses the phone-keyed customer in the order transaction. */
export const findOrCreateCustomerForOrder = async (
  tx: PrismaTypes.TransactionClient,
  input: CreateOrderInput,
  ip: CanonicalIpAddress,
  deviceFingerprint: string | null,
) => {
  const deviceDelegate = (tx as unknown as {
    customerDevice: {
      findUnique: (args: { where: { fingerprintHash: string } }) => Promise<{ isBlocked: boolean } | null>;
      upsert: (args: {
        where: { fingerprintHash: string };
        create: { fingerprintHash: string };
        update: { lastSeenAt: Date };
      }) => Promise<unknown>;
    };
  }).customerDevice;
  const [existingCustomer, blockedIp, blockedDevice] = await Promise.all([
    tx.customer.findUnique({ where: { normalizedPhone: input.normalizedPhone } }),
    tx.blockedIp.findUnique({ where: { address: ip.address } }),
    deviceFingerprint ? deviceDelegate.findUnique({ where: { fingerprintHash: deviceFingerprint } }) : null,
  ]);

  if (existingCustomer?.isBlocked || blockedIp?.isBlocked || blockedDevice?.isBlocked) {
    throw new AppError('Order cannot be placed', 403);
  }

  if (deviceFingerprint) {
    await deviceDelegate.upsert({
      where: { fingerprintHash: deviceFingerprint },
      create: { fingerprintHash: deviceFingerprint },
      update: { lastSeenAt: new Date() },
    });
  }

  if (existingCustomer) return existingCustomer;

  const customer = await tx.customer.create({
    data: {
      name: input.customerName,
      phone: input.phone,
      normalizedPhone: input.normalizedPhone,
    },
  });

  await writeSecurityAudit(tx, {
    targetType: SecurityAuditTargetType.CUSTOMER,
    targetId: customer.id,
    action: SecurityAuditAction.CUSTOMER_CREATED,
    actor: { actorLabel: 'CHECKOUT' },
    requestIp: ip.address,
    newValue: { created: true },
  });

  return customer;
};

export const listCustomers = async (query: CustomerListQuery) => {
  const where: Prisma.CustomerWhereInput = {
    ...(query.blocked === 'all' ? {} : { isBlocked: query.blocked === 'true' }),
  };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { phone: { contains: query.search } },
      { normalizedPhone: { contains: query.search.replace(/\D/g, '') } },
      { orders: { some: { clientIp: { contains: query.search } } } },
      { orders: { some: { deviceFingerprint: { contains: query.search.toLowerCase() } } } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [total, customers] = await typedPrisma.$transaction([
    typedPrisma.customer.count({ where }),
    typedPrisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.limit,
      include: { _count: { select: { orders: true } } },
    }),
  ]);

  const customerIds = customers.map((customer) => customer.id);
  if (customerIds.length === 0) {
    return { total, data: [], page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
  }

  const [aggregates, latestOrders, customerOrderRefs] = await Promise.all([
    typedPrisma.order.groupBy({
      by: ['customerId'],
      where: { customerId: { in: customerIds }, status: { not: 'CANCELLED' } },
      _sum: { totalAmount: true },
    }),
    typedPrisma.order.findMany({
      where: { customerId: { in: customerIds } },
      orderBy: { createdAt: 'desc' },
      select: { customerId: true, city: true, address: true, clientIp: true, createdAt: true },
    }),
    typedPrisma.order.findMany({
      where: { customerId: { in: customerIds } },
      select: { customerId: true, normalizedPhone: true, phone: true, clientIp: true, deviceFingerprint: true },
    }),
  ]);

  const amountByCustomer = new Map(aggregates.map((item) => [item.customerId, item._sum.totalAmount]));
  const latestByCustomer = new Map<string, (typeof latestOrders)[number]>();
  for (const order of latestOrders) {
    if (order.customerId && !latestByCustomer.has(order.customerId)) {
      latestByCustomer.set(order.customerId, order);
    }
  }
  const latestIpAddresses = [...new Set(latestOrders.map((order) => order.clientIp).filter((ip): ip is string => Boolean(ip)))];
  const activeBlockedIps = latestIpAddresses.length
    ? await typedPrisma.blockedIp.findMany({
        where: { address: { in: latestIpAddresses }, isBlocked: true },
        select: { address: true },
      })
    : [];
  const blockedIpSet = new Set(activeBlockedIps.map((item) => item.address));

  const customerFingerprints = [...new Set(customerOrderRefs.map((order) => order.deviceFingerprint).filter((value): value is string => Boolean(value)))];
  const [deviceRows, associatedOrders] = customerFingerprints.length
    ? await Promise.all([
        typedPrisma.customerDevice.findMany({ where: { fingerprintHash: { in: customerFingerprints } } }),
        typedPrisma.order.findMany({
          where: { deviceFingerprint: { in: customerFingerprints } },
        select: { deviceFingerprint: true, phone: true, normalizedPhone: true, clientIp: true, customerId: true, customer: { select: { isBlocked: true } } },
        }),
      ])
    : [[], []] as const;
  const deviceMap = new Map(deviceRows.map((device) => [device.fingerprintHash, device]));
  const associationsByDevice = new Map<string, { phones: Set<string>; phoneCustomers: Map<string, { customerId: string | null; isBlocked: boolean }>; ips: Set<string> }>();
  for (const order of associatedOrders) {
    if (!order.deviceFingerprint) continue;
    const association = associationsByDevice.get(order.deviceFingerprint) ?? { phones: new Set<string>(), phoneCustomers: new Map<string, { customerId: string | null; isBlocked: boolean }>(), ips: new Set<string>() };
    association.phones.add(order.phone);
    association.phoneCustomers.set(order.phone, { customerId: order.customerId, isBlocked: order.customer?.isBlocked ?? false });
    if (order.clientIp) association.ips.add(order.clientIp);
    associationsByDevice.set(order.deviceFingerprint, association);
  }
  const fingerprintsByCustomer = new Map<string, Set<string>>();
  for (const order of customerOrderRefs) {
    if (!order.customerId || !order.deviceFingerprint) continue;
    const set = fingerprintsByCustomer.get(order.customerId) ?? new Set<string>();
    set.add(order.deviceFingerprint);
    fingerprintsByCustomer.set(order.customerId, set);
  }

  return {
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
    data: customers.map((customer) => ({
      ...customer,
      totalOrderValue: amountByCustomer.get(customer.id) ?? new Prisma.Decimal(0),
      devices: [...(fingerprintsByCustomer.get(customer.id) ?? [])].map((fingerprintHash) => {
        const device = deviceMap.get(fingerprintHash);
        const association = associationsByDevice.get(fingerprintHash);
        return {
          id: device?.id ?? fingerprintHash,
          label: fingerprintHash.slice(0, 12).toUpperCase(),
          isBlocked: device?.isBlocked ?? false,
          ips: [...(association?.ips ?? [])].sort(),
          phones: [...(association?.phones ?? [])].sort(),
          phoneCustomers: [...(association?.phoneCustomers ?? new Map()).entries()].map(([phone, customer]) => ({ phone, ...customer })).sort((a, b) => a.phone.localeCompare(b.phone)),
          lastSeenAt: device?.lastSeenAt ?? null,
        };
      }),
      latestOrder: (() => {
        const latest = latestByCustomer.get(customer.id);
        return latest ? { ...latest, ipBlocked: Boolean(latest.clientIp && blockedIpSet.has(latest.clientIp)) } : null;
      })(),
    })),
  };
};

export const getCustomerById = async (id: string, query: CustomerDetailQuery) => {
  const customer = await typedPrisma.customer.findUnique({ where: { id } });
  if (!customer) throw new AppError('Customer not found', 404);

  const where = { customerId: id };
  const skip = (query.page - 1) * query.limit;
  const [total, orders, totalOrderValue] = await Promise.all([
    typedPrisma.order.count({ where }),
    typedPrisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.limit,
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
          include: { product: { select: { image: true } } },
        },
      },
    }),
    typedPrisma.order.aggregate({
      where: { ...where, status: { not: 'CANCELLED' } },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    customer,
    orders,
    total,
    page: query.page,
    limit: query.limit,
    totalPages: Math.ceil(total / query.limit),
    totalOrderValue: totalOrderValue._sum.totalAmount ?? new Prisma.Decimal(0),
  };
};

const setCustomerBlocked = async (
  id: string,
  blocked: boolean,
  input: CustomerBlockInput,
  actor: ManagementActor,
) => typedPrisma.$transaction(async (tx) => {
  const current = await tx.customer.findUnique({ where: { id } });
  if (!current) throw new AppError('Customer not found', 404);

  const reason = blocked ? input.reason ?? null : null;
  const unchanged = current.isBlocked === blocked && current.blockReason === reason;
  if (unchanged) return current;

  const updated = await tx.customer.update({
    where: { id },
    data: blocked
      ? {
          isBlocked: true,
          blockReason: reason,
          blockedAt: new Date(),
          blockedBy: actor.actorId ?? actor.actorLabel ?? null,
        }
      : { isBlocked: false, blockReason: null, blockedAt: null, blockedBy: null },
  });

  await writeSecurityAudit(tx, {
    targetType: SecurityAuditTargetType.CUSTOMER,
    targetId: id,
    action: blocked ? SecurityAuditAction.CUSTOMER_BLOCKED : SecurityAuditAction.CUSTOMER_UNBLOCKED,
    actor,
    oldValue: {
      isBlocked: current.isBlocked,
      blockReason: current.blockReason,
      blockedAt: current.blockedAt?.toISOString() ?? null,
    },
    newValue: {
      isBlocked: updated.isBlocked,
      blockReason: updated.blockReason,
      blockedAt: updated.blockedAt?.toISOString() ?? null,
    },
  });

  return updated;
});

export const blockCustomer = (id: string, input: CustomerBlockInput, actor: ManagementActor) =>
  setCustomerBlocked(id, true, input, actor);

export const unblockCustomer = (id: string, actor: ManagementActor) =>
  setCustomerBlocked(id, false, { reason: null }, actor);

export const setCustomerDeviceBlocked = async (
  id: string,
  blocked: boolean,
  input: CustomerBlockInput,
  actor: ManagementActor,
) => typedPrisma.$transaction(async (tx) => {
  const current = await tx.customerDevice.findUnique({ where: { id } });
  if (!current) throw new AppError('Customer device not found', 404);
  if (current.isBlocked === blocked && (!blocked || current.blockReason === (input.reason ?? null))) return current;

  const now = new Date();
  const updated = await tx.customerDevice.update({
    where: { id },
    data: blocked
      ? { isBlocked: true, blockReason: input.reason ?? null, blockedAt: now, blockedBy: actor.actorId ?? actor.actorLabel ?? null, unblockedAt: null, unblockedBy: null }
      : { isBlocked: false, unblockedAt: now, unblockedBy: actor.actorId ?? actor.actorLabel ?? null },
  });
  await writeSecurityAudit(tx, {
    targetType: SecurityAuditTargetType.DEVICE,
    targetId: id,
    action: blocked ? SecurityAuditAction.DEVICE_BLOCKED : SecurityAuditAction.DEVICE_UNBLOCKED,
    actor,
    oldValue: { isBlocked: current.isBlocked, reason: current.blockReason },
    newValue: { isBlocked: updated.isBlocked, reason: updated.blockReason, label: current.fingerprintHash.slice(0, 12) },
  });
  return updated;
});

export const blockCustomerDevice = (id: string, input: CustomerBlockInput, actor: ManagementActor) =>
  setCustomerDeviceBlocked(id, true, input, actor);

export const unblockCustomerDevice = (id: string, actor: ManagementActor) =>
  setCustomerDeviceBlocked(id, false, { reason: null }, actor);

export const listBlockedIps = async (query: BlockedIpListQuery) => {
  const where: Prisma.BlockedIpWhereInput = {
    ...(query.status === 'active' ? { isBlocked: true } : {}),
    ...(query.search ? { address: { contains: query.search } } : {}),
  };
  const skip = (query.page - 1) * query.limit;
  const [total, data] = await typedPrisma.$transaction([
    typedPrisma.blockedIp.count({ where }),
    typedPrisma.blockedIp.findMany({
      where,
      orderBy: { blockedAt: 'desc' },
      skip,
      take: query.limit,
    }),
  ]);
  return { total, data, page: query.page, limit: query.limit, totalPages: Math.ceil(total / query.limit) };
};

export const blockIp = async (input: BlockIpInput, actor: ManagementActor) =>
  typedPrisma.$transaction(async (tx) => {
    const current = await tx.blockedIp.findUnique({ where: { address: input.ipAddress.address } });
    const now = new Date();
    const updated = current
      ? await tx.blockedIp.update({
          where: { id: current.id },
          data: {
            family: input.ipAddress.family,
            isBlocked: true,
            reason: input.reason,
            blockedAt: now,
            blockedBy: actor.actorId ?? actor.actorLabel ?? null,
            unblockedAt: null,
            unblockedBy: null,
          },
        })
      : await tx.blockedIp.create({
          data: {
            address: input.ipAddress.address,
            family: input.ipAddress.family,
            isBlocked: true,
            reason: input.reason,
            blockedAt: now,
            blockedBy: actor.actorId ?? actor.actorLabel ?? null,
          },
        });

    await writeSecurityAudit(tx, {
      targetType: SecurityAuditTargetType.IP,
      targetId: updated.id,
      action: SecurityAuditAction.IP_BLOCKED,
      actor,
      oldValue: current
        ? { isBlocked: current.isBlocked, reason: current.reason }
        : { isBlocked: false, reason: null },
      newValue: { isBlocked: true, reason: updated.reason, address: updated.address, family: updated.family },
    });
    return updated;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

export const unblockIp = async (id: string, actor: ManagementActor) =>
  typedPrisma.$transaction(async (tx) => {
    const current = await tx.blockedIp.findUnique({ where: { id } });
    if (!current) throw new AppError('Blocked IP record not found', 404);
    if (!current.isBlocked) return current;

    const updated = await tx.blockedIp.update({
      where: { id },
      data: {
        isBlocked: false,
        unblockedAt: new Date(),
        unblockedBy: actor.actorId ?? actor.actorLabel ?? null,
      },
    });
    await writeSecurityAudit(tx, {
      targetType: SecurityAuditTargetType.IP,
      targetId: id,
      action: SecurityAuditAction.IP_UNBLOCKED,
      actor,
      oldValue: { isBlocked: current.isBlocked, reason: current.reason },
      newValue: { isBlocked: updated.isBlocked, reason: updated.reason },
    });
    return updated;
  });
