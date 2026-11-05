import type { Request, Response } from 'express';
import { z } from 'zod';
import { AppError } from '../utils/AppError.js';
import { toMoneyString } from '../utils/order-money.util.js';
import { getSocketPeerIp } from '../utils/ip-address.util.js';
import {
  blockCustomer,
  blockCustomerDevice,
  blockIp,
  getCustomerById,
  listBlockedIps,
  listCustomers,
  unblockCustomer,
  unblockCustomerDevice,
  unblockIp,
  type ManagementActor,
} from '../services/customer.service.js';
import type { OrderWithItems } from '../services/order.service.js';
import {
  blockedIpIdSchema,
  blockedIpListQuerySchema,
  customerDetailQuerySchema,
  customerIdSchema,
  customerDeviceIdSchema,
  customerListQuerySchema,
  type BlockIpInput,
  type CustomerBlockInput,
} from '../validations/customer.validation.js';

const parseWithSchema = <T extends z.ZodType>(schema: T, value: unknown): z.output<T> => {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new AppError('Validation failed', 400, parsed.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })));
  }
  return parsed.data;
};

const requireSellerActor = (res: Response, req: Request): ManagementActor => {
  const seller = res.locals.sellerUser as { id?: string; name?: string } | undefined;
  if (!seller?.id) throw new AppError('Seller authentication is not configured', 503);
  return {
    actorId: seller.id,
    actorLabel: seller.name ?? null,
    requestIp: getSocketPeerIp(req)?.address ?? null,
  };
};

const serializeOrder = (order: OrderWithItems) => ({
  id: order.id,
  orderCode: order.orderCode,
  status: order.status,
  paymentMethod: order.paymentMethod,
  city: order.city,
  address: order.address,
  clientIp: order.clientIp,
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

export const listCustomersHandler = async (req: Request, res: Response) => {
  requireSellerActor(res, req);
  const query = parseWithSchema(customerListQuerySchema, req.query);
  const result = await listCustomers(query);
  return res.status(200).json({
    success: true,
    count: result.total,
    data: result.data.map((customer) => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      normalizedPhone: customer.normalizedPhone,
      isBlocked: customer.isBlocked,
      blockReason: customer.blockReason,
      blockedAt: customer.blockedAt,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      totalOrders: customer._count.orders,
      totalOrderValue: toMoneyString(customer.totalOrderValue),
      lastOrderDate: customer.latestOrder?.createdAt ?? null,
      address: customer.latestOrder?.address ?? null,
      city: customer.latestOrder?.city ?? null,
      ipAddress: customer.latestOrder?.clientIp ?? null,
      isIpBlocked: customer.latestOrder?.ipBlocked ?? false,
      devices: customer.devices,
    })),
    pagination: { page: result.page, limit: result.limit, totalPages: result.totalPages },
  });
};

export const getCustomerByIdHandler = async (req: Request, res: Response) => {
  requireSellerActor(res, req);
  const id = parseWithSchema(customerIdSchema, req.params.id);
  const query = parseWithSchema(customerDetailQuerySchema, req.query);
  const result = await getCustomerById(id, query);
  return res.status(200).json({
    success: true,
    data: {
      ...result.customer,
      totalOrders: result.total,
      totalOrderValue: toMoneyString(result.totalOrderValue),
      orders: result.orders.map(serializeOrder),
      pagination: { page: result.page, limit: result.limit, totalPages: result.totalPages },
    },
  });
};

export const blockCustomerHandler = async (req: Request, res: Response) => {
  const actor = requireSellerActor(res, req);
  const id = parseWithSchema(customerIdSchema, req.params.id);
  // The route's validate middleware already parsed and transformed this body.
  // Parsing it again rejects its normalized `reason: null` output.
  const input = req.body as CustomerBlockInput;
  const customer = await blockCustomer(id, input, actor);
  return res.status(200).json({ success: true, data: customer });
};

export const unblockCustomerHandler = async (req: Request, res: Response) => {
  const actor = requireSellerActor(res, req);
  const id = parseWithSchema(customerIdSchema, req.params.id);
  const customer = await unblockCustomer(id, actor);
  return res.status(200).json({ success: true, data: customer });
};

export const blockCustomerDeviceHandler = async (req: Request, res: Response) => {
  const actor = requireSellerActor(res, req);
  const id = parseWithSchema(customerDeviceIdSchema, req.params.id);
  const device = await blockCustomerDevice(id, req.body as CustomerBlockInput, actor);
  return res.status(200).json({ success: true, data: device });
};

export const unblockCustomerDeviceHandler = async (req: Request, res: Response) => {
  const actor = requireSellerActor(res, req);
  const id = parseWithSchema(customerDeviceIdSchema, req.params.id);
  const device = await unblockCustomerDevice(id, actor);
  return res.status(200).json({ success: true, data: device });
};

export const listBlockedIpsHandler = async (req: Request, res: Response) => {
  requireSellerActor(res, req);
  const query = parseWithSchema(blockedIpListQuerySchema, req.query);
  const result = await listBlockedIps(query);
  return res.status(200).json({
    success: true,
    count: result.total,
    data: result.data,
    pagination: { page: result.page, limit: result.limit, totalPages: result.totalPages },
  });
};

export const blockIpHandler = async (req: Request, res: Response) => {
  const actor = requireSellerActor(res, req);
  // The route's validate middleware canonicalizes the address into { address, family }.
  // Re-parsing that transformed value as the original string shape fails validation.
  const input = req.body as BlockIpInput;
  const record = await blockIp(input, actor);
  return res.status(201).json({ success: true, data: record });
};

export const unblockIpHandler = async (req: Request, res: Response) => {
  const actor = requireSellerActor(res, req);
  const id = parseWithSchema(blockedIpIdSchema, req.params.id);
  const record = await unblockIp(id, actor);
  return res.status(200).json({ success: true, data: record });
};



/*


8661604160:AAEDnvyV66wyo1Oc5aFTccFGUvpkkUYSTXs
-1004366737668


*/
