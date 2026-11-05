import { Prisma } from '@prisma/client';
import type { OrderCity } from '@prisma/client';
import { AppError } from './AppError.js';

const MAX_ORDER_MONEY = new Prisma.Decimal('9999999999.99');

export interface ProductPriceInput {
  price: number;
  discount: number;
}

export interface CalculatedOrderPrice {
  unitPrice: Prisma.Decimal;
  lineTotal: Prisma.Decimal;
}

export const assertOrderMoneyFits = (value: Prisma.Decimal): Prisma.Decimal => {
  if (!value.isFinite() || value.isNegative() || value.greaterThan(MAX_ORDER_MONEY)) {
    throw new AppError('Product price cannot be processed for ordering', 400);
  }
  return value;
};

/** Mirrors the frontend rule while performing the arithmetic in Decimal. */
export const calculateOrderItemPrice = (
  product: ProductPriceInput,
  quantity: number,
): CalculatedOrderPrice => {
  if (!Number.isFinite(product.price) || product.price <= 0) {
    throw new AppError('Product price is invalid', 400);
  }
  if (!Number.isFinite(product.discount) || product.discount < 0 || product.discount > 100) {
    throw new AppError('Product discount is invalid', 400);
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new AppError('Quantity must be a positive integer', 400);
  }

  // Convert the persisted Float through its shortest decimal representation,
  // never through binary floating-point arithmetic for monetary operations.
  const basePrice = new Prisma.Decimal(product.price.toString());
  const discount = new Prisma.Decimal(product.discount.toString());
  const unitPrice = product.discount > 0
    ? basePrice.mul(new Prisma.Decimal(100).minus(discount))
      .div(100)
      .toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP)
    : basePrice.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

  assertOrderMoneyFits(unitPrice);
  const lineTotal = assertOrderMoneyFits(
    unitPrice.mul(quantity).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP),
  );

  return { unitPrice, lineTotal };
};

export const calculateDeliveryCharge = (
  city: OrderCity,
  subtotal = new Prisma.Decimal('0'),
  settings?: { insideDhakaCharge?: number; outsideDhakaCharge?: number; freeDeliveryThreshold?: number },
): Prisma.Decimal => {
  const freeThreshold = settings?.freeDeliveryThreshold ?? 5000;
  if (subtotal.greaterThanOrEqualTo(freeThreshold)) return new Prisma.Decimal('0.00');
  const charge = city === 'dhaka'
    ? settings?.insideDhakaCharge ?? 80
    : settings?.outsideDhakaCharge ?? 150;
  return new Prisma.Decimal(charge.toString()).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
};

export const toMoneyString = (value: Prisma.Decimal): string =>
  value.toFixed(2);
