{
    "id": "12",
    "title": "Traditional Metal Panjabi Buttons",
    "price": 450,
    "discount": 0,
    "category": "Accessories",
    "subCategory": "Buttons",
    "productType": "Panjabi Button",
    "image": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=600"
    ],
    "color": "GOLDEN",
    "availableSizes": [],
    "description": "Exquisite metal buttons designed specifically to elevate the look of traditional Panjabis and Kablis.",
    "material": "Brass Alloy",
    "fit": "Standard Set",
    "careInstructions": [
      "Keep away from water and perfume",
      "Store in dry box"
    ],
    "sku": "RA-ACC-BTN-801"
  }


  এটা আমার প্রোডাক্ট json 

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

এটা আমার config/prisma.ts 


এখন আমাকে product এর backend এ prisma/schema.prisma, controllers, services, validations , routes তৈরি করুন  