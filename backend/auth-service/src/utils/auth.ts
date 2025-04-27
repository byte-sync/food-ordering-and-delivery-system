import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export const hashPassword = async (password: string) => await bcrypt.hash(password, 10);
export const comparePassword = async (plain: string, hash: string) => await bcrypt.compare(plain, hash);

export const generateToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: expiresIn
  } as jwt.SignOptions);
};

// Generate a 6-digit numeric OTP
export const generateOtp = () => {
  const min = 100000; // 6 digits (100000-999999)
  const max = 999999;
  return Math.floor(min + Math.random() * (max - min)).toString();
};
