import { Request, Response } from 'express';
import catchAsync from '../shared/catchAsync.js';
import sendResponse from '../shared/sendResponse.js';
import httpStatus from 'http-status';
import {
  createUserIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
} from '../services/user.service.js';

export const createUserHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await createUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully and credentials sent to email!',
    data: result,
  });
});

export const getUsersHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

export const getUserByIdHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await getUserByIdFromDB(String(id));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully!',
    data: result,
  });
});

export const updateUserHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await updateUserIntoDB(String(id), req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully!',
    data: result,
  });
});

export const deleteUserHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await deleteUserFromDB(String(id));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully!',
    data: result,
  });
});