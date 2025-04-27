import { Request, Response } from 'express';
import { SignUpSchema, SignInSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../validators/auth.schema';
import * as AuthService from '../services/auth.service';
import { sendEmail } from '../utils/email';

export const signUp = async (req: Request, res: Response) => {
  try {
    const validationResult = SignUpSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      // Format Zod validation errors for better client-side handling
      const formattedErrors = validationResult.error.format();
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: formattedErrors
      });
    }
    
    const { email, password, userType, profile } = validationResult.data;
    
    const result = await AuthService.registerUser(email, password, userType, profile);
    res.status(201).json({ message: 'User registered', ...result });
  } catch (err: any) {
    console.error('Signup error:', err);
    // Check for specific error types to provide better messages
    if (err.message.includes('Email already exists')) {
      return res.status(400).json({ error: 'Email already in use. Please use a different email address.' });
    }
    res.status(400).json({ error: err.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password, device, ipAddress } = SignInSchema.parse(req.body);
    const result = await AuthService.loginUser(email, password, device, ipAddress);
    res.status(200).json({ 
      message: 'Logged in successfully', 
      userId: result.userId,
      sessionId: result.sessionId,
      token: result.sessionToken
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = ForgotPasswordSchema.parse(req.body);
    const result = await AuthService.forgotPassword(email);
    res.status(200).json({ message: 'Password reset request processed', ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
       return res.status(400).json({ error: 'Email and OTP are required' });
    }
    const result = await AuthService.verifyOtp(email, otp);
    res.status(200).json({ message: 'OTP verified successfully', ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, ipAddress } = ResetPasswordSchema.parse(req.body);
    const result = await AuthService.resetPassword(email, newPassword, ipAddress);
    res.status(200).json({ message: 'Password reset successful', ...result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Send an email with custom content
 * Used for system notifications and custom emails
 */
export const sendCustomEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, content } = req.body;
    
    // Validate required fields
    if (!to || !subject || !content) {
       return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to, subject, content' 
      });
    }

    // Send the email
    await sendEmail(to, subject, content);
    
    //  success response
    res.status(200).json({ 
      success: true, 
      message: `Email sent successfully to ${to}` 
    });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    res.status(500).json({ 
      success: false, 
      error: `Failed to send email: ${error.message}` 
    });
  }
};
