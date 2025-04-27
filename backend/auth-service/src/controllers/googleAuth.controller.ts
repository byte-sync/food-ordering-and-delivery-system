import { Request, Response } from 'express';
import { verifyGoogleToken } from '../services/googleAuth.service';
import { FRONTEND_URL } from '../config/googleAuth';
import { OAuth2Client } from 'google-auth-library';
import { UserModel } from '../models/User';
import { createSession } from '../utils/sessionClient';
import axios from 'axios';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8085/api/users';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// Extended Request interface that includes the user property
interface AuthRequest extends Request {
  user?: any;
}

/**
 * Authenticate with Google token
 * This endpoint accepts the token after successful frontend Google Authentication
 */
export const googleTokenAuth = async (req: Request, res: Response) => {
  try {
    const { token, device, ipAddress = req.ip || req.socket.remoteAddress || '0.0.0.0' } = req.body;
    
    console.log('Received Google auth request:', {
      hasToken: !!token,
      device: device?.substring(0, 20) + '...',
      ipAddress
    });
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Check if the token has the format of an access token (starts with "ya29.")
    const isAccessToken = token.startsWith('ya29.') || !token.includes('.');
    let payload;
    
    if (isAccessToken) {
      // Handle Google access token
      try {
        console.log('Processing as Google access token');
        // Use tokeninfo endpoint to validate the access token
        const tokenInfo = await axios.get(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(token)}`
        );
        
        if (!tokenInfo.data || !tokenInfo.data.email) {
          console.error('Invalid access token information:', tokenInfo.data);
          return res.status(401).json({ error: 'Invalid access token - missing user information' });
        }
        
        // Construct a payload similar to what we'd get from an ID token
        payload = {
          email: tokenInfo.data.email,
          sub: tokenInfo.data.sub || tokenInfo.data.user_id || `google-${Date.now()}`,
          name: tokenInfo.data.name,
          picture: tokenInfo.data.picture
        };
        
        console.log('Successfully verified access token and retrieved user info');
      } catch (error: any) {
        console.error('Failed to verify access token:', error);
        if (error.response) {
          console.error('Google API error response:', {
            status: error.response.status,
            data: error.response.data
          });
        }
        return res.status(401).json({ error: 'Invalid access token - verification failed' });
      }
    } else {
      // Handle ID token verification
      try {
        console.log('Processing as Google ID token');
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: CLIENT_ID
        });
        payload = ticket.getPayload();
        console.log('Successfully verified ID token');
      } catch (error) {
        console.error('Failed to verify ID token:', error);
        return res.status(401).json({ error: 'Invalid ID token' });
      }
    }
    
    if (!payload) {
      console.error('Invalid Google token payload');
      return res.status(400).json({ error: 'Invalid token payload' });
    }
    
    const { email, sub: googleId, name, picture } = payload;
    console.log('Google payload received:', { email, googleId: googleId?.substring(0, 5) + '...', hasName: !!name, hasPicture: !!picture });
    
    // Rest of the function remains the same
    if (!email) {
      return res.status(400).json({ error: 'Email not provided in Google token' });
    }
    
    // Check if user already exists
    let user = await UserModel.findOne({ $or: [{ email }, { googleId }] });
    let isNewUser = false;
    let profileIncomplete = false;
    
    if (!user) {
      // Create new user with Google auth
      isNewUser = true;
      user = new UserModel({
        email,
        googleId,
        isGoogleUser: true,
        authProvider: 'google',
        userType: 'CUSTOMER', // Default to customer type, can be changed later
      });
      
      console.log('Creating new user with Google auth:', { email, googleId: googleId?.substring(0, 5) + '...', userType: 'CUSTOMER' });
      await user.save();
      profileIncomplete = true;
      console.log('New Google user created:', { userId: user._id.toString() });
    } else {
      console.log('Found existing user:', { userId: user._id.toString(), isGoogleUser: user.isGoogleUser });
      // If existing user doesn't have Google ID, add it
      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        user.authProvider = 'google';
        await user.save();
        console.log('Updated existing user with Google ID');
      }
      
      // Check if profile is complete by checking user-service
      try {
        const userServiceResponse = await axios.get(`${USER_SERVICE_URL}/email/${email}`);
        console.log('User service profile check response:', { exists: !!userServiceResponse.data });
        if (!userServiceResponse.data) {
          profileIncomplete = true;
          console.log('Profile is incomplete based on user service check');
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        profileIncomplete = true;
        console.log('Setting profile as incomplete due to error checking user service');
      }
    }
    
    // Create a session for the user
    console.log('Creating session for user:', { userId: user._id.toString(), ipAddress, device: device?.substring(0, 20) + '...' });
    const sessionResult = await createSession(user._id.toString(), ipAddress, device);
    console.log('Session created successfully:', { sessionId: sessionResult.sessionId });
    
    const response = {
      message: isNewUser ? 'Google account connected successfully' : 'Signed in with Google',
      userId: user._id,
      sessionId: sessionResult.sessionId,
      token: sessionResult.token,
      userType: user.userType,
      profileIncomplete: profileIncomplete,
      email: email,
      isNewUser: isNewUser
    };
    
    console.log('Responding to client with:', { 
      message: response.message, 
      userType: response.userType, 
      profileIncomplete, 
      isNewUser 
    });
    
    res.status(200).json(response);
    
  } catch (error: any) {
    console.error('Google authentication error:', error);
    console.error('Stack trace:', error.stack);
    if (error.response) {
      console.error('Google API error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    res.status(500).json({ 
      error: error.message || 'Failed to authenticate with Google',
      details: error.response?.data || 'No additional details available'
    });
  }
};

/**
 * Authenticate with Google user data
 * This endpoint accepts user data directly from the frontend after Google Authentication
 */
export const googleUserAuth = async (req: Request, res: Response) => {
  try {
    const { userData, device, ipAddress = req.ip || req.socket.remoteAddress || '0.0.0.0' } = req.body;
    
    console.log('Received Google user data request:', {
      hasUserData: !!userData,
      device: device?.substring(0, 20) + '...',
      ipAddress
    });
    
    if (!userData || !userData.email || !userData.sub) {
      return res.status(400).json({ error: 'Invalid user data provided' });
    }
    
    const { email, sub: googleId, name, picture } = userData;
    
    console.log('Google user data received:', { 
      email, 
      googleId: googleId?.substring(0, 5) + '...', 
      hasName: !!name, 
      hasPicture: !!picture 
    });
    
    // Check if user already exists
    let user = await UserModel.findOne({ $or: [{ email }, { googleId }] });
    let isNewUser = false;
    let profileIncomplete = false;
    
    if (!user) {
      // Create new user with Google auth
      isNewUser = true;
      user = new UserModel({
        email,
        googleId,
        isGoogleUser: true,
        authProvider: 'google',
        userType: 'CUSTOMER', 
      });
      
      console.log('Creating new user with Google auth:', { email, googleId: googleId?.substring(0, 5) + '...', userType: 'CUSTOMER' });
      await user.save();
      profileIncomplete = true;
      console.log('New Google user created:', { userId: user._id.toString() });
    } else {
      console.log('Found existing user:', { userId: user._id.toString(), isGoogleUser: user.isGoogleUser });
      // If existing user doesn't have Google ID, add it
      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        user.authProvider = 'google';
        await user.save();
        console.log('Updated existing user with Google ID');
      }
      
      // Check if profile is complete by checking user-service
      try {
        const userServiceResponse = await axios.get(`${USER_SERVICE_URL}/email/${email}`);
        console.log('User service profile check response:', { exists: !!userServiceResponse.data });
        if (!userServiceResponse.data) {
          profileIncomplete = true;
          console.log('Profile is incomplete based on user service check');
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        profileIncomplete = true;
        console.log('Setting profile as incomplete due to error checking user service');
      }
    }
    
    // Create a session for the user
    console.log('Creating session for user:', { userId: user._id.toString(), ipAddress, device: device?.substring(0, 20) + '...' });
    const sessionResult = await createSession(user._id.toString(), ipAddress, device);
    console.log('Session created successfully:', { sessionId: sessionResult.sessionId });
    
    const response = {
      message: isNewUser ? 'Google account connected successfully' : 'Signed in with Google',
      userId: user._id,
      sessionId: sessionResult.sessionId,
      token: sessionResult.token,
      userType: user.userType,
      profileIncomplete: profileIncomplete,
      email: email,
      isNewUser: isNewUser
    };
    
    console.log('Responding to client with:', { 
      message: response.message, 
      userType: response.userType, 
      profileIncomplete, 
      isNewUser 
    });
    
    res.status(200).json(response);
    
  } catch (error: any) {
    console.error('Google authentication error:', error);
    console.error('Stack trace:', error.stack);
    if (error.response) {
      console.error('Google API error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    res.status(500).json({ 
      error: error.message || 'Failed to authenticate with Google',
      details: error.response?.data || 'No additional details available'
    });
  }
};

/**
 * Redirects user after Google authentication
 * This handles the redirect after a successful or failed Google auth
 */
export const googleAuthRedirect = async (req: Request, res: Response) => {
  try {
    // Handle OAuth redirect
    res.status(200).json({ message: 'Google auth successful' });
  } catch (error: any) {
    console.error('Google redirect error:', error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Check if a Google-authenticated user has a complete profile
 */
export const checkProfileCompletion = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Find user in auth database
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user exists in user-service (profile data)
    try {
      const response = await axios.get(`${USER_SERVICE_URL}/${userId}`);
      const userProfile = response.data;
      
      // Check if profile has required fields based on user type
      let isComplete = true;
      const missingFields = [];
      
      if (user.userType === 'CUSTOMER') {
        if (!userProfile.firstName || !userProfile.lastName || !userProfile.contactNumber) {
          isComplete = false;
          missingFields.push('basic profile information');
        }
      } else if (user.userType === 'RESTAURANT') {
        if (!userProfile.restaurantName || !userProfile.restaurantLicenseNumber || 
            !userProfile.cuisineTypeIds || !userProfile.restaurantTypeId) {
          isComplete = false;
          missingFields.push('restaurant details');
        }
      } else if (user.userType === 'DRIVER') {
        if (!userProfile.vehicleNumber || !userProfile.vehicleTypeId) {
          isComplete = false;
          missingFields.push('vehicle information');
        }
      }
      
      return res.status(200).json({
        isComplete,
        userType: user.userType,
        email: user.email,
        missingFields
      });
      
    } catch (error) {
      return res.status(200).json({
        isComplete: false,
        userType: user.userType,
        email: user.email,
        missingFields: ['profile data']
      });
    }
    
  } catch (error: any) {
    console.error('Profile completion check error:', error);
    res.status(500).json({ error: error.message || 'Failed to check profile completion' });
  }
};