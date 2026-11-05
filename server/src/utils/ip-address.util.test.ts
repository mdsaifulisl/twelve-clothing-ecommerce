import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request } from 'express';
import { canonicalizeIpAddress, getSocketPeerIp } from './ip-address.util.js';

test('validates and canonicalizes IPv4 and IPv6 addresses', () => {
  assert.deepEqual(canonicalizeIpAddress('192.0.2.10'), {
    address: '192.0.2.10',
    family: 'IPV4',
  });
  assert.deepEqual(canonicalizeIpAddress('2001:0db8:0000:0000:0000:ff00:0042:8329'), {
    address: '2001:db8::ff00:42:8329',
    family: 'IPV6',
  });
  assert.deepEqual(canonicalizeIpAddress('::ffff:192.0.2.10'), {
    address: '192.0.2.10',
    family: 'IPV4',
  });
  assert.equal(canonicalizeIpAddress('not-an-ip'), null);
});

test('uses the socket peer and ignores forwarded headers', () => {
  const request = {
    socket: { remoteAddress: '2001:0db8::1' },
    headers: { 'x-forwarded-for': '203.0.113.20' },
  } as unknown as Request;

  assert.deepEqual(getSocketPeerIp(request), { address: '2001:db8::1', family: 'IPV6' });
});
