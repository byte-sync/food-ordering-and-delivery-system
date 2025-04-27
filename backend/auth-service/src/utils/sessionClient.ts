import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Get the Session Service URL from environment variables
const SESSION_SERVICE_URL = process.env.SESSION_SERVICE_URL || 'http://localhost:5007';
console.log('Session service URL:', SESSION_SERVICE_URL); // Log the URL being used

/**
 * Creates a new session for a user
 */
export const createSession = async (userId: string, ipAddress: string, device: string) => {
  const url = `${SESSION_SERVICE_URL}/api/sessions/create`;
  console.log(`Attempting to create session at: ${url}`);
  console.log('With payload:', { userId, device, ipAddress });
  
  try {
    const response = await axios.post(url, {
      userId,
      device,
      ipAddress
    });
    
    console.log('Session creation successful:', response.data);
    
    // Make sure we're properly extracting the sessionId and token from the response
    // This ensures we have the correct structure regardless of how the session service formats its response
    return {
      sessionId: response.data.sessionId || response.data.id || response.data._id,
      token: response.data.token || response.data.sessionToken
    };
  } catch (error: any) {
    console.error('Full error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      requestUrl: url
    });
    throw new Error(`Failed to create session: ${error.message}`);
  }
};

/**
 * Invalidates all sessions for a user
 */
export const invalidateAllSessions = async (userId: string) => {
  try {
    const url = `${SESSION_SERVICE_URL}/api/sessions/invalidate/user`;
    
    const response = await axios.post(url, {
      userId
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error invalidating sessions:', error.response?.data || error.message);
    throw new Error(`Failed to invalidate sessions: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * Invalidates all sessions except the current one
 */
export const invalidateAllExceptCurrent = async (userId: string, ipAddress: string) => {
  try {
    const url = `${SESSION_SERVICE_URL}/api/sessions/invalidate/other`;
    
    const response = await axios.post(url, {
      userId,
      ipAddress
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error invalidating other sessions:', error.response?.data || error.message);
    throw new Error(`Failed to invalidate other sessions: ${error.response?.data?.error || error.message}`);
  }
};

/**
 * Verifies a token with the session service
 */
export const verifyToken = async (token: string) => {
  try {
    const url = `${SESSION_SERVICE_URL}/api/sessions/verify`;
    
    const response = await axios.post(url, {
      token
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error verifying token:', error.response?.data || error.message);
    throw new Error(`Failed to verify token: ${error.response?.data?.error || error.message}`);
  }
};