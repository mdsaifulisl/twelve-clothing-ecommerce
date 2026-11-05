import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import type { CreateStoreLocationInput } from '../validations/storeLocation.validation.js';

export const listStoreLocations = () => prisma.storeLocation.findMany({
  orderBy: [{ division: 'asc' }, { name: 'asc' }],
});

export const createStoreLocation = (input: CreateStoreLocationInput) => prisma.storeLocation.create({
  data: input,
});

export const deleteStoreLocation = async (id: string) => {
  try {
    return await prisma.storeLocation.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError('Store location not found', 404);
    }
    throw error;
  }
};
