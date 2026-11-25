import prisma from '../config/prisma.js';

// সব লগ ফেচ করা (সার্চ ও ফিল্টার সাপোর্টেড)
export const getAllLogsFromDB = async (searchTerm?: string, module?: string) => {
  const whereCondition: any = {};

  if (searchTerm) {
    whereCondition.OR = [
      { userName: { contains: searchTerm, mode: 'insensitive' } },
      { action: { contains: searchTerm, mode: 'insensitive' } },
      { details: { contains: searchTerm, mode: 'insensitive' } },
      { ipAddress: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  if (module && module !== 'All') {
    whereCondition.module = module;
  }

  const logs = await prisma.activityLog.findMany({
    where: whereCondition,
    orderBy: {
      timestamp: 'desc',
    },
  });

  return logs;
};

// নতুন লগ এন্ট্রি তৈরি করা
export const createActivityLogIntoDB = async (payload: {
  userName: string;
  userRole: 'Admin' | 'Moderator' | 'Editor' | 'Support';
  action: string;
  module: 'Orders' | 'Products' | 'Customers' | 'Sliders' | 'Team';
  details: string;
  ipAddress: string;
}) => {
  const newLog = await prisma.activityLog.create({
    data: payload,
  });
  return newLog; 
};

// সব লগ ট্রাঙ্কেট বা ডিলিট করা (Clear Audit Logs)
export const clearAllLogsFromDB = async () => {
  await prisma.activityLog.deleteMany({});
  return { message: 'All activity logs cleared successfully' };
};