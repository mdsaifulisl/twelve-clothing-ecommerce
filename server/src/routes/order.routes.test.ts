import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';
import app from '../app.js';

let server: ReturnType<typeof app.listen>;
let baseUrl: string;

before(async () => {
  await new Promise<void>((resolve, reject) => {
    server = app.listen(0, '127.0.0.1', (error?: Error) => error ? reject(error) : resolve());
  });
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (server) await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('seller order endpoints fail closed without server-side seller authentication', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousLocalSellerOptIn = process.env.ENABLE_LOCAL_SELLER_API;
  process.env.NODE_ENV = 'test';
  delete process.env.ENABLE_LOCAL_SELLER_API;

  const requests: Array<[string, RequestInit?]> = [
    ['/api/v1/orders'],
    ['/api/v1/orders/not-a-real-order'],
    ['/api/v1/orders/not-a-real-order/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DELIVERED' }),
    }],
    ['/api/v1/orders/not-a-real-order/archive', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ archived: true }),
    }],
    ['/api/v1/orders/not-a-real-order/seen', { method: 'PATCH' }],
    ['/api/v1/customers'],
    ['/api/v1/customers/not-a-real-customer'],
    ['/api/v1/customers/not-a-real-customer/block', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'test' }),
    }],
    ['/api/v1/customers/not-a-real-customer/unblock', { method: 'PATCH' }],
    ['/api/v1/blocked-ips'],
    ['/api/v1/blocked-ips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ipAddress: '192.0.2.20' }),
    }],
    ['/api/v1/blocked-ips/not-a-real-ip/unblock', { method: 'PATCH' }],
    ['/api/v1/sliders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test slide', image: '/uploads/slider/test.webp' }),
    }],
    ['/api/v1/sliders/not-a-real-id', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated slide' }),
    }],
    ['/api/v1/sliders/not-a-real-id', { method: 'DELETE' }],
    ['/api/v1/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test outlet', address: 'Dhaka', phone: '01812345678' }),
    }],
    ['/api/v1/locations/not-a-real-id', { method: 'DELETE' }],
    ['/api/v1/about-section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test', paragraph1: 'Test', buttonLink: '/items' }),
    }],
  ];

  try {
    for (const [path, init] of requests) {
      const response = await fetch(`${baseUrl}${path}`, init);
      const payload = await response.json() as { success?: boolean; message?: string; data?: unknown };
      assert.equal(response.status, 503, path);
      assert.equal(payload.success, false, path);
      assert.equal(payload.data, undefined, path);
    }
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
    if (previousLocalSellerOptIn === undefined) delete process.env.ENABLE_LOCAL_SELLER_API;
    else process.env.ENABLE_LOCAL_SELLER_API = previousLocalSellerOptIn;
  }
});

test('public order lookup remains outside the seller management gate', async () => {
  const response = await fetch(`${baseUrl}/api/v1/orders/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderCode: '', phone: '' }),
  });
  const payload = await response.json() as { success?: boolean; message?: string };
  assert.equal(response.status, 400);
  assert.equal(payload.success, false);
  assert.equal(payload.message, 'Validation failed');
});

test('invalid checkout request is rejected before any database access', async () => {
  const response = await fetch(`${baseUrl}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'Buyer',
      phone: '01012345678',
      address: 'Dhaka',
      city: 'dhaka',
      paymentMethod: 'cod',
      items: [{ productId: 'product-id', size: 'Free Size', quantity: 1 }],
    }),
  });
  const payload = await response.json() as { success?: boolean; message?: string };
  assert.equal(response.status, 400);
  assert.equal(payload.success, false);
  assert.equal(payload.message, 'Validation failed');
});
