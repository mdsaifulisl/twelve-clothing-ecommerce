import { isIP } from 'node:net';
import type { Request } from 'express';

export type CanonicalIpFamily = 'IPV4' | 'IPV6';

export interface CanonicalIpAddress {
  address: string;
  family: CanonicalIpFamily;
}

export const canonicalizeIpAddress = (value: string): CanonicalIpAddress | null => {
  const input = value.trim();
  const family = isIP(input);

  if (family === 4) {
    const address = input.split('.').map((part) => String(Number(part))).join('.');
    return { address, family: 'IPV4' };
  }
  if (family !== 6) return null;

  try {
    // WHATWG URL parsing applies IPv6 compression and lowercase canonicalization.
    const canonical = new URL(`http://[${input}]/`).hostname.slice(1, -1).toLowerCase();
    const mapped = canonical.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
    if (mapped) {
      const high = Number.parseInt(mapped[1], 16);
      const low = Number.parseInt(mapped[2], 16);
      return {
        address: `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`,
        family: 'IPV4',
      };
    }
    return { address: canonical, family: 'IPV6' };
  } catch {
    return null;
  }
};

/** Uses only the transport peer address. Forwarded headers are intentionally ignored. */
export const getSocketPeerIp = (request: Request): CanonicalIpAddress | null => {
  const peer = request.socket.remoteAddress;
  return peer ? canonicalizeIpAddress(peer) : null;
};
