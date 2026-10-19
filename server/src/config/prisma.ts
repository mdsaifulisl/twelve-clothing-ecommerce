import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient } = require('@prisma/client');

// প্রিজমা ইনস্ট্যান্স তৈরি (টাইপ সেফটি সহ)
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('✅ MySQL Database Connected Successfully via Prisma!');
  } catch (error: any) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

export default prisma;