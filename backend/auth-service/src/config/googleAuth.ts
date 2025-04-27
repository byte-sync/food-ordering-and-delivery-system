import dotenv from 'dotenv';
dotenv.config();

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost/api/auth-service/auth/google/callback';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Verify that Google credentials are set
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('Google OAuth credentials not set. Google authentication will not work properly.');
}