import { Router, Request, Response, NextFunction } from 'express';
import * as AuthController from '../controllers/auth.controller';

const router = Router();

// Define explicitly typed handlers to resolve TypeScript issues
type RequestHandler = (req: Request, res: Response, next?: NextFunction) => Promise<any> | void;

// Auth routes with explicit casting to ensure TypeScript compatibility
router.post('/signup', AuthController.signUp as RequestHandler);
router.post('/signin', AuthController.signIn as RequestHandler);
router.post('/forgot-password', AuthController.forgotPassword as RequestHandler);
router.post('/verify-otp', AuthController.verifyOtp as RequestHandler);
router.post('/reset-password', AuthController.resetPassword as RequestHandler);

// Email sending route
router.post('/send-email', AuthController.sendCustomEmail as RequestHandler);

export default router;
