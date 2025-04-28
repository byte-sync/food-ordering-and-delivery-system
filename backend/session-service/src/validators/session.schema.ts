import { z } from 'zod';

export const CreateSessionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  device: z.string().min(1, "Device name is required"),
  ipAddress: z.string().min(1, "IP Address is required"),
});

export const VerifyTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const InvalidateSessionSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});

export const InvalidateUserSessionsSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const InvalidateExceptCurrentSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  ipAddress: z.string().min(1, "IP Address is required"),
});

export const GetActiveSessionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  ipAddress: z.string().min(1, "IP Address is required"),
});
