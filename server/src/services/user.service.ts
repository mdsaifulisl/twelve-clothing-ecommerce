import { Prisma } from '@prisma/client';
import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import { userEvents } from '../events/user.events.js'; 
import { AppError } from '../utils/AppError.js';
import httpStatus from 'http-status';

// ১. ডাটাবেজে ইউজার না থাকলে ডিফল্ট অ্যাডমিন তৈরি করার ফাংশন
export const seedDefaultAdminIntoDB = async () => {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    });

    console.log('Default admin created: admin@gmail.com / admin123');
  }
};

interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  role?: 'admin' | 'moderator' | 'seller';
}

interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: 'admin' | 'moderator' | 'seller';
  status?: 'active' | 'inactive';
}

// ২. নতুন ইউজার ক্রিয়েট এবং অটো পাসওয়ার্ড জেনারেট করে ইমেইল পাঠানো
export const createUserIntoDB = async (payload: CreateUserPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists!', Number(httpStatus.CONFLICT));
  }

  const rawPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      password: hashedPassword,
      role: payload.role || 'moderator',
      status: 'active',
    },
  });

  
  userEvents.emit('userCreated', {
    email: newUser.email,
    name: newUser.name,
    rawPassword: rawPassword,
  });

  const { password, ...result } = newUser;
  return result;
};

// ৩. সব ইউজার গেট করা
export const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

// ৪. নির্দিষ্ট ইউজার আইডি দিয়ে গেট করা
export const getUserByIdFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found!', Number(httpStatus.NOT_FOUND));
  }

  return user;
};

// ৫. ইউজার আপডেট করা
export const updateUserIntoDB = async (id: string, payload: UpdateUserPayload) => {
  await getUserByIdFromDB(id); // ইউজার এক্সিস্ট করে কিনা চেক করা

  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// ৬. ইউজার ডিলিট করা
export const deleteUserFromDB = async (id: string) => {
  await getUserByIdFromDB(id); // ইউজার এক্সিস্ট করে কিনা চেক করা

  const deletedUser = await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return deletedUser;
};