import { OAuth2Client } from 'google-auth-library';
import { UserModel } from '../models/User';
import { createSession } from '../utils/sessionClient';
import { GOOGLE_CLIENT_ID } from '../config/googleAuth';

// Create an OAuth client for verifying Google tokens
// Ensure the client ID is always a string
const client = new OAuth2Client(GOOGLE_CLIENT_ID || '');

/**
 * Verify a Google ID token and authenticate or register the user
 * @param idToken The Google ID token to verify
 * @param ipAddress The IP address of the client
 * @param device The device info of the client
 * @returns User session information
 */
export const verifyGoogleToken = async (idToken: string, ipAddress: string, device: string) => {
  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID || '', // Ensure string type
    });

    // Get the payload from the token
    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    // Extract user information from the payload
    const { email, sub: googleId, name, picture } = payload;
    if (!email) {
      throw new Error('Email not provided in Google token');
    }

    // Check if the user already exists by email or Google ID
    let user = await UserModel.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      // If the user exists but doesn't have a Google ID, update it
      if (!user.googleId) {
        user.googleId = googleId;
        user.isGoogleUser = true;
        user.authProvider = 'google';
        await user.save();
      }
    } else {
      // Create a new user if one doesn't exist
      user = new UserModel({
        email,
        googleId,
        isGoogleUser: true,
        authProvider: 'google',
        userType: 'CUSTOMER', // Default user type for social sign-ups
      });
      await user.save();
    }

    // Create a session for the user
    const sessionResult = await createSession(user._id.toString(), ipAddress, device);

    // Return session information
    return {
      userId: user._id.toString(),
      email: user.email,
      userType: user.userType,
      sessionId: sessionResult.sessionId,
      sessionToken: sessionResult.token,
    };
  } catch (error: any) {
    console.error('Google token verification error:', error);
    throw new Error(`Google authentication failed: ${error.message}`);
  }
};

/**
 * Helper function to extract first and last name from a full name
 * @param fullName The full name to split
 * @returns Object containing firstName and lastName
 */
export const extractNames = (fullName?: string): { firstName: string; lastName: string } => {
  if (!fullName) {
    return { firstName: '', lastName: '' };
  }
  
  const names = fullName.trim().split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';
  
  return { firstName, lastName };
};