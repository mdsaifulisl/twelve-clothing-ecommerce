import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // 🟢 ১. এটি ইমপোর্ট করুন
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import customerRoutes from './routes/customer.routes.js';
import blockedIpRoutes from './routes/blockedIp.routes.js';
import sliderRoutes from './routes/slider.routes.js';
import storeLocationRoutes from './routes/storeLocation.routes.js';
import aboutSectionRoutes from './routes/aboutSection.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import termsRoutes from './routes/terms.routes.js';
import faqRoutes from './routes/faq.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';


// globalErrorHandler
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

// 🟢 ২. __dirname ডিফাইন করুন
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Application = express();

// মিডলওয়্যার
app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true,                
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// স্ট্যাটিক ফোল্ডার (এখন এটি সঠিকভাবে কাজ করবে)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// app.use(express.static(path.join(process.cwd(), 'public')));
// app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// টেস্ট রুট
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Twelve Clothing API Server!');
});

// প্রোডাক্ট রাউট
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/blocked-ips', blockedIpRoutes);
app.use('/api/v1/sliders', sliderRoutes);
app.use('/api/v1/locations', storeLocationRoutes);
app.use('/api/v1/about-section', aboutSectionRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/terms', termsRoutes);
app.use('/api/v1/faq', faqRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);


app.use(globalErrorHandler);

export default app;
