import express from 'express';
import * as authController from '../controllers/auth-controller';
import * as googleAuthController from '../controllers/google-auth-controller';
import { validateLoginInput, validateRegistrationInput } from '../validators/auth-validator';

const router = express.Router();

// Health check
router.get('/health', googleAuthController.healthCheck);

// Authentication routes
router.post('/sign-up', validateRegistrationInput, authController.register);
router.post('/sign-in', validateLoginInput, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);

// Google auth routes
router.post('/google/token', googleAuthController.handleGoogleToken);
router.post('/google/complete-profile', googleAuthController.completeGoogleProfile);

// Client info
router.get('/client-ip', (req, res) => {
  res.json({ ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress });
});

export default router;