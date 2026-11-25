import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync.js';
import sendResponse from '../shared/sendResponse.js';
import { getSocketPeerIp } from '../utils/ip-address.util.js';
import httpStatus from 'http-status';
import {
  getAllLogsFromDB,
  createActivityLogIntoDB,
  clearAllLogsFromDB,
} from '../services/logs.service.js';

export const getLogsHandler = catchAsync(async (req: Request, res: Response) => {
  const { search, module } = req.query;
  const result = await getAllLogsFromDB(
    search as string,
    module as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Activity logs retrieved successfully!',
    data: result,
  });
});

export const createLogHandler = catchAsync(async (req: Request, res: Response) => {
  const peerIp = getSocketPeerIp(req);
  if (!peerIp) throw new Error('Unable to determine request IP');
  
  // প্রিজমা স্কিমার ফিল্ডের নামের সাথে মিলিয়ে দেওয়া
  req.body.ipAddress = peerIp; 

  const result = await createActivityLogIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Activity log recorded successfully!',
    data: result,
  });
});

export const clearLogsHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await clearAllLogsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All logs cleared successfully!',
    data: result,
  });
}); 