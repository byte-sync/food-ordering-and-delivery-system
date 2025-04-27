import { Router, Request, Response, NextFunction } from 'express';
import * as AuthController from '../controllers/auth.controller';
import * as GoogleAuthController from '../controllers/googleAuth.controller';

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

// Google authentication routes
router.post('/google/token', GoogleAuthController.googleTokenAuth as RequestHandler);
router.post('/google/user', GoogleAuthController.googleUserAuth as RequestHandler);
router.post('/google/signin', GoogleAuthController.googleTokenAuth as RequestHandler); // Added this route to match frontend
router.get('/google/callback', GoogleAuthController.googleAuthRedirect as RequestHandler);
router.get('/profile-completion/:userId', GoogleAuthController.checkProfileCompletion as RequestHandler);

export default router;
