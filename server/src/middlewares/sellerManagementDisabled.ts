import type { NextFunction, Request, Response } from 'express';
import { getSocketPeerIp } from '../utils/ip-address.util.js';

/**
 * A local-only development test gate, not seller authentication.
 * Seller APIs remain disabled unless both explicit development opt-ins apply.
 */
export const sellerManagementDisabled = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'development' || process.env.ENABLE_LOCAL_SELLER_API !== 'true') {
    return res.status(503).json({
      success: false,
      message: 'Seller management APIs are disabled until server-side authentication is configured.',
    });
  }

  // Only the TCP peer is trusted. Forwarded/client-provided headers are ignored.
  const peer = getSocketPeerIp(req);
  if (!peer || (peer.family === 'IPV4' ? peer.address !== '127.0.0.1' : peer.address !== '::1')) {
    return res.status(403).json({
      success: false,
      message: 'Local seller API access is limited to loopback connections.',
    });
  }

  // Controllers require an actor to write audit entries. This identity is deliberately
  // synthetic and must never be treated as an authenticated seller account.
  res.locals.sellerUser = { id: 'local-development', name: 'Local development only' };
  return next();
};
