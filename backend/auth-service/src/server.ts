import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
// app.use(cors({ 
//   origin: process.env.CORS_ORIGIN || '*',
//   credentials: true
// }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});