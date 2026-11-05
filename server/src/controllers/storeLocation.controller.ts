import type { Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import { createStoreLocation, deleteStoreLocation, listStoreLocations } from '../services/storeLocation.service.js';
import { storeLocationIdSchema, type CreateStoreLocationInput } from '../validations/storeLocation.validation.js';

const parseLocationId = (value: string | string[]) => {
  const result = storeLocationIdSchema.safeParse(Array.isArray(value) ? value[0] : value);
  if (!result.success) {
    throw new AppError('Validation failed', 400, result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })));
  }
  return result.data;
};

export const listStoreLocationsHandler = async (_req: Request, res: Response) => {
  const locations = await listStoreLocations();
  return res.status(200).json({ success: true, count: locations.length, data: locations });
};

export const createStoreLocationHandler = async (req: Request, res: Response) => {
  const location = await createStoreLocation(req.body as CreateStoreLocationInput);
  return res.status(201).json({ success: true, message: 'Store location created successfully', data: location });
};

export const deleteStoreLocationHandler = async (req: Request, res: Response) => {
  const id = parseLocationId(req.params.id);
  await deleteStoreLocation(id);
  return res.status(200).json({ success: true, message: 'Store location deleted successfully' });
};
