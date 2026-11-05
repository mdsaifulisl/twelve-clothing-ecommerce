import assert from 'node:assert/strict';
import test from 'node:test';
import { OrderCity } from '@prisma/client';
import { calculateDeliveryCharge, calculateOrderItemPrice, toMoneyString } from './order-money.util.js';
import { normalizeBangladeshPhone } from './phone.util.js';
import { createOrderSchema } from '../validations/order.validation.js';

test('normalizes supported Bangladesh mobile formats to the same canonical phone', () => {
  const expected = { phone: '01711223344', normalizedPhone: '8801711223344' };

  assert.deepEqual(normalizeBangladeshPhone('01711223344'), expected);
  assert.deepEqual(normalizeBangladeshPhone('+880 1711-223344'), expected);
  assert.deepEqual(normalizeBangladeshPhone('880 (1711) 223344'), expected);
  assert.deepEqual(normalizeBangladeshPhone('০১৭১১-২২৩৩৪৪'), expected);
});

test('rejects malformed and unsupported Bangladesh mobile numbers', () => {
  assert.equal(normalizeBangladeshPhone('01011223344'), null);
  assert.equal(normalizeBangladeshPhone('01211223344'), null);
  assert.equal(normalizeBangladeshPhone('0171122334'), null);
  assert.equal(normalizeBangladeshPhone('+880 0211-223344'), null);
  assert.equal(normalizeBangladeshPhone('01711x23344'), null);
});

test('rounds discounted unit price to whole taka using half-up rounding', () => {
  const result = calculateOrderItemPrice({ price: 1005, discount: 10 }, 2);
  assert.equal(toMoneyString(result.unitPrice), '905.00');
  assert.equal(toMoneyString(result.lineTotal), '1810.00');
});

test('normalizes undiscounted Float price to two decimal places', () => {
  const result = calculateOrderItemPrice({ price: 1250.126, discount: 0 }, 3);
  assert.equal(toMoneyString(result.unitPrice), '1250.13');
  assert.equal(toMoneyString(result.lineTotal), '3750.39');
});

test('calculates delivery charge from the server-side city value', () => {
  assert.equal(toMoneyString(calculateDeliveryCharge(OrderCity.dhaka)), '80.00');
  assert.equal(toMoneyString(calculateDeliveryCharge(OrderCity.outside)), '150.00');
});

test('checkout validation accepts a null product color but never trusts submitted prices', () => {
  const parsed = createOrderSchema.parse({
    customerName: 'Buyer',
    phone: '01711223344',
    address: 'Dhaka',
    city: 'dhaka',
    paymentMethod: 'online',
    subtotal: 1,
    deliveryCharge: 1,
    totalAmount: 2,
    items: [{ productId: 'product-id', size: 'Free Size', color: null, quantity: 1, price: 1, discount: 99 }],
  });

  assert.equal(parsed.items[0].color, '');
  assert.equal('subtotal' in parsed, false);
  assert.equal('price' in parsed.items[0], false);
  assert.equal('discount' in parsed.items[0], false);
});
