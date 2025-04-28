import { z } from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Registration validation schema
export const registrationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// OTP validation schema
export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 characters"),
});

// New password validation schema for reset after forgot password
export const newPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;