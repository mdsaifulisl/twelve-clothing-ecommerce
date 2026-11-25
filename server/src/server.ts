import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/prisma.js';
import { seedDefaultAdminIntoDB } from './services/user.service.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 5001;

const startServer = async () => {
  try {
    // ১. ডাটাবেজ কানেক্ট করা
    await connectDB();
    await seedDefaultAdminIntoDB();

    
    const localSellerApiEnabled =
      process.env.NODE_ENV === 'development' && process.env.ENABLE_LOCAL_SELLER_API === 'true';
    if (localSellerApiEnabled) {
      // Keep the explicitly opted-in test server unreachable from non-local interfaces.
      app.listen(PORT, '127.0.0.1', () => {
        console.log(`🚀 Local seller API test server is running on http://127.0.0.1:${PORT}`);
      });
    } else {
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
      });
    }
  } catch (error: any) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
