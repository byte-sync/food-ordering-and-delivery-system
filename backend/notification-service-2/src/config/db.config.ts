import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
}