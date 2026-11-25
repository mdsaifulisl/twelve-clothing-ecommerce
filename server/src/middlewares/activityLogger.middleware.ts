import { Request, Response, NextFunction } from 'express';
import { getSocketPeerIp } from '../utils/ip-address.util.js';
import prisma from '../config/prisma.js';

export const autoActivityLogger = (
  moduleName: 'Orders' | 'Products' | 'Customers' | 'Sliders' | 'Team',
  actionName: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res);

    res.json = (bodyData) => {
      if (bodyData && (bodyData.success === true || bodyData.statusCode < 400)) {
        const user = (req as any).user;
        const rawIp = getSocketPeerIp(req);

        // 🟢 সুনিশ্চিত করা যেন ipAddress সবসময় একটি স্ট্রিং হয়
        let peerIp = 'Unknown';
        if (typeof rawIp === 'string') {
          peerIp = rawIp;
        } else if (rawIp && typeof rawIp === 'object' && 'address' in rawIp) {
          peerIp = (rawIp as any).address;
        }

        const userName = user?.name || 'Admin User';
        const rawRole = user?.role || 'admin';
        const formattedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1);

        prisma.activityLog
          .create({
            data: {
              userName: userName,
              userRole: formattedRole, // "Admin" | "Moderator" | "Seller"
              action: actionName,
              module: moduleName,
              details: `Performed '${actionName}' on ${moduleName} module successfully.`,
              ipAddress: peerIp, // এখন এটি নিশ্চিতভাবে একটি স্ট্রিং
            },
          })
          .catch((err: any) => {
            console.error('❌ Failed to record activity log:', err);
          });
      }

      return originalJson(bodyData);
    };

    next();
  };
};