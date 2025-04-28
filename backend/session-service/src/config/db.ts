import mongoose from 'mongoose';
import logger from '../utils/logger';
import dotenv from 'dotenv';

dotenv.config();

// Get MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/session-service';

/**
 * Connect to MongoDB database
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('MongoDB connected successfully');
  } catch (error: any) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
