import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Get JWT secret from environment variables or use fallback
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-jwt-secret-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1d'; // 1 day default

interface JwtPayload {
  userId: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

/**
 * Creates a JWT token for a session
 * @param userId - User ID to include in the token
 * @param sessionId - Session ID to include in the token
 * @returns The signed JWT token
 */
export const createToken = (userId: string, sessionId: string): string => {
  // JWT library accepts either a number (seconds) or specific string formats
  let expiresIn: number | undefined = undefined;
  
  if (JWT_EXPIRES_IN.endsWith('d')) {
    const days = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresIn = days * 24 * 60 * 60; // Convert days to seconds
  } else if (JWT_EXPIRES_IN.endsWith('h')) {
    const hours = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresIn = hours * 60 * 60; // Convert hours to seconds
  } else if (JWT_EXPIRES_IN.endsWith('m')) {
    const minutes = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresIn = minutes * 60; // Convert minutes to seconds
  } else if (JWT_EXPIRES_IN.endsWith('s')) {
    expiresIn = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10); // Already in seconds
  } else {
    // Use default expiration of 1 day if format is unrecognized
    expiresIn = 24 * 60 * 60; // 1 day in seconds
  }
  
  const options: SignOptions = { expiresIn };
  
  return jwt.sign(
    { userId, sessionId },
    JWT_SECRET,
    options
  );
};

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token - JWT token to verify
 * @returns The decoded token payload or null if verification fails
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error: any) {
    return null;
  }
};

/**
 * Calculate expiration date based on current time
 * @returns Date object representing token expiration
 */
export const getExpirationDate = (): Date => {
  // Parse the JWT_EXPIRES_IN value
  let expiresInMs: number;
  
  if (JWT_EXPIRES_IN.endsWith('d')) {
    const days = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresInMs = days * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  } else if (JWT_EXPIRES_IN.endsWith('h')) {
    const hours = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresInMs = hours * 60 * 60 * 1000; // Convert hours to milliseconds
  } else if (JWT_EXPIRES_IN.endsWith('m')) {
    const minutes = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresInMs = minutes * 60 * 1000; // Convert minutes to milliseconds
  } else if (JWT_EXPIRES_IN.endsWith('s')) {
    const seconds = parseInt(JWT_EXPIRES_IN.slice(0, -1), 10);
    expiresInMs = seconds * 1000; // Convert seconds to milliseconds
  } else {
    // Default to 1 day if format is unrecognized
    expiresInMs = 24 * 60 * 60 * 1000;
  }
  
  return new Date(Date.now() + expiresInMs);
};
