import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user-service';
import { SessionService } from '../services/session-service';
import { AuthLogService } from '../services/auth-log-service';
import { createError, createSuccess } from '../utils/response-utils';

// Service instances
const userService = new UserService();
const sessionService = new SessionService();
const authLogService = new AuthLogService();

/**
 * Health check endpoint
 */
export async function healthCheck(req: Request, res: Response): Promise<void> {
  res.status(200).json({ status: 'ok', service: 'auth-service' });
}

/**
 * Handle Google authentication
 * Verifies the Google OAuth token and creates or logs in the user
 */
export async function handleGoogleToken(req: Request, res: Response): Promise<void> {
  try {
    // Extract data from request
    const { token, device, ipAddress } = req.body;

    if (!token) {
      res.status(400).json(createError('Missing Google OAuth token'));
      return;
    }

    // Verify the token with Google
    let googleUserInfo;
    try {
      const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      googleUserInfo = googleResponse.data;

      console.log('Google user info:', {
        email: googleUserInfo.email, 
        sub: googleUserInfo.sub,
        name: googleUserInfo.name,
        picture: googleUserInfo?.picture?.substring(0, 30) + '...' // Truncated for logs
      });

      if (!googleUserInfo.email || !googleUserInfo.sub) {
        res.status(400).json(createError('Invalid Google user information'));
        return;
      }
    } catch (error: any) {
      console.error('Google token validation error:', error.response?.data || error.message);
      res.status(401).json(createError('Failed to validate Google token'));
      return;
    }

    // Look for an existing user with this Google ID or email
    try {
      const existingUser = await userService.findByGoogleId(googleUserInfo.sub) || 
                          await userService.findByEmail(googleUserInfo.email);

      if (existingUser) {
        // User already exists, create a session and log the user in
        console.log('Existing user found, creating session:', existingUser.id);
        
        // Log the authentication event
        await authLogService.logAuthEvent({
          userId: existingUser.id,
          type: 'google-login',
          status: 'success',
          ipAddress: ipAddress || req.ip,
          device: device || req.headers['user-agent'] || 'unknown',
          timestamp: new Date()
        });

        // If user profile is incomplete, notify frontend
        const profileIncomplete = !existingUser.isProfileComplete;

        // Create a session
        const { token: authToken, sessionId } = await sessionService.createSession({
          userId: existingUser.id,
          userType: existingUser.userType,
          ipAddress: ipAddress || req.ip,
          device: device || req.headers['user-agent'] || 'unknown'
        });

        // Return success with the token and user data
        res.status(200).json(createSuccess({
          userId: existingUser.id,
          userType: existingUser.userType,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          profilePicture: existingUser.profileImage,
          token: authToken,
          sessionId,
          profileIncomplete,
          isNewUser: false
        }));
      } else {
        // Create a new user with Google data
        console.log('No existing user, registering new user with Google data');
        
        // Create a partial user record
        const newUser = await userService.createGoogleUser({
          email: googleUserInfo.email,
          googleId: googleUserInfo.sub,
          firstName: googleUserInfo.given_name || googleUserInfo.name?.split(' ')[0] || '',
          lastName: googleUserInfo.family_name || googleUserInfo.name?.split(' ').slice(1).join(' ') || '',
          profileImage: googleUserInfo.picture || null
        });

        // Log the registration event
        await authLogService.logAuthEvent({
          userId: newUser.id,
          type: 'google-register',
          status: 'success',
          ipAddress: ipAddress || req.ip,
          device: device || req.headers['user-agent'] || 'unknown',
          timestamp: new Date()
        });

        // Return success with user data but mark that profile completion is needed
        res.status(200).json(createSuccess({
          userId: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          profilePicture: newUser.profileImage,
          profileIncomplete: true,
          isNewUser: true
        }));
      }
    } catch (error: any) {
      console.error('Error processing Google login:', error);
      res.status(500).json(createError(`Server error: ${error.message}`));
    }
  } catch (error: any) {
    console.error('Unhandled error in Google auth controller:', error);
    res.status(500).json(createError('Internal server error during Google authentication'));
  }
}

/**
 * Complete a Google user's profile with additional information
 */
export async function completeGoogleProfile(req: Request, res: Response): Promise<void> {
  try {
    const { userId, userType, phone, address, ...additionalData } = req.body;

    if (!userId || !userType) {
      res.status(400).json(createError('Missing required fields: userId and userType'));
      return;
    }

    // Update the user profile
    const updatedUser = await userService.updateUser(userId, {
      userType,
      phone,
      address,
      isProfileComplete: true,
      ...additionalData
    });

    // Create a session for the newly completed profile
    const { token: authToken, sessionId } = await sessionService.createSession({
      userId,
      userType,
      ipAddress: req.ip,
      device: req.headers['user-agent'] || 'unknown'
    });

    // Return success with token and completed profile
    res.status(200).json(createSuccess({
      userId: updatedUser.id,
      userType: updatedUser.userType,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      profilePicture: updatedUser.profileImage,
      token: authToken,
      sessionId,
      profileIncomplete: false
    }));
  } catch (error: any) {
    console.error('Error completing Google profile:', error);
    res.status(500).json(createError(`Server error: ${error.message}`));
  }
}