import express, { Application, Request, Response } from 'express';
import cors from 'cors';

const app: Application = express();

// মিডলওয়্যার
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// টেস্ট রুট
// টেস্ট রুট
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Twelve Clothing API Server!');
});

// ভবিষ্যতে এখানে অন্যান্য রাউট যুক্ত হবে (যেমন: productRoutes, authRoutes ইত্যাদি)
// app.use('/api/v1/products', productRoutes);

export default app;