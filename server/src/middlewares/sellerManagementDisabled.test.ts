import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sellerManagementDisabled } from './sellerManagementDisabled.js';

const invoke = (remoteAddress: string | undefined, forwardedFor?: string) => {
  let statusCode: number | undefined;
  let payload: unknown;
  let nextCalls = 0;
  const req = {
    socket: { remoteAddress },
    headers: forwardedFor ? { 'x-forwarded-for': forwardedFor } : {},
  } as never;
  const res = {
    locals: {} as Record<string, unknown>,
    status(code: number) { statusCode = code; return this; },
    json(body: unknown) { payload = body; return this; },
  } as never;
  sellerManagementDisabled(req, res, (() => { nextCalls += 1; }) as never);
  return { statusCode, payload, nextCalls, locals: (res as { locals: Record<string, unknown> }).locals };
};

const withEnvironment = (nodeEnv: string | undefined, optIn: string | undefined, action: () => void) => {
  const oldNodeEnv = process.env.NODE_ENV;
  const oldOptIn = process.env.ENABLE_LOCAL_SELLER_API;
  try {
    if (nodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = nodeEnv;
    if (optIn === undefined) delete process.env.ENABLE_LOCAL_SELLER_API;
    else process.env.ENABLE_LOCAL_SELLER_API = optIn;
    action();
  } finally {
    if (oldNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = oldNodeEnv;
    if (oldOptIn === undefined) delete process.env.ENABLE_LOCAL_SELLER_API;
    else process.env.ENABLE_LOCAL_SELLER_API = oldOptIn;
  }
};

test('allows IPv4 and IPv6 loopback only with both development opt-ins', () => {
  withEnvironment('development', 'true', () => {
    for (const peer of ['127.0.0.1', '::1', '::ffff:127.0.0.1']) {
      const result = invoke(peer);
      assert.equal(result.nextCalls, 1, peer);
      assert.equal(result.locals.sellerUser && (result.locals.sellerUser as { id: string }).id, 'local-development');
    }
  });
});

test('ignores forwarded headers and denies a non-loopback socket peer', () => {
  withEnvironment('development', 'true', () => {
    const result = invoke('192.0.2.10', '127.0.0.1');
    assert.equal(result.statusCode, 403);
    assert.equal(result.nextCalls, 0);
  });
});

test('denies seller APIs in production even when local opt-in is set', () => {
  withEnvironment('production', 'true', () => {
    const result = invoke('127.0.0.1');
    assert.equal(result.statusCode, 503);
    assert.equal(result.nextCalls, 0);
  });
});

test('denies seller APIs when local opt-in is missing', () => {
  withEnvironment('development', undefined, () => {
    const result = invoke('127.0.0.1');
    assert.equal(result.statusCode, 503);
    assert.equal(result.nextCalls, 0);
  });
});
