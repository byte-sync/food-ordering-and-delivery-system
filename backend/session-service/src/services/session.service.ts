import { v4 as uuidv4 } from 'uuid';
import { SessionModel } from '../model/session.model';
import { createToken, verifyToken, getExpirationDate } from '../utils/jwt.utils';
import logger from '../utils/logger';

/**
 * Creates or extends a user session
 * If a session exists for the user with the same IP, extends it
 * Otherwise creates a new session
 */
export const createOrExtendSession = async (userId: string, ipAddress: string, device: string) => {
  try {
    // Check if a session already exists for this user and IP address
    const existingSession = await SessionModel.findOne({ 
      userId, 
      ipAddress,
      expiresAt: { $gt: new Date() } // Only consider non-expired sessions
    });

    if (existingSession) {
      logger.info(`Extending existing session for user ${userId} from IP ${ipAddress}`);
      
      // Update expiration time
      const expiresAt = getExpirationDate();
      
      // Create new JWT token
      const token = createToken(userId, existingSession.sessionId);
      
      // Update session in database
      await SessionModel.updateOne(
        { sessionId: existingSession.sessionId },
        { 
          $set: {
            expiresAt,
            jwtToken: token
          }
        }
      );

      return {
        sessionId: existingSession.sessionId,
        token,
        expiresAt
      };
    }

    // Create a new session
    logger.info(`Creating new session for user ${userId} from IP ${ipAddress}`);
    const sessionId = uuidv4();
    const expiresAt = getExpirationDate();
    const token = createToken(userId, sessionId);

    const newSession = await SessionModel.create({
      userId,
      sessionId,
      device,
      ipAddress,
      jwtToken: token,
      expiresAt
    });

    return {
      sessionId: newSession.sessionId,
      token,
      expiresAt
    };
  } catch (error: any) {
    logger.error('Error creating/extending session:', error);
    throw new Error(`Failed to create or extend session: ${error.message}`);
  }
};

/**
 * Invalidates all sessions for a user
 */
export const invalidateAllSessions = async (userId: string) => {
  try {
    const result = await SessionModel.deleteMany({ userId });
    logger.info(`Invalidated ${result.deletedCount} sessions for user ${userId}`);
    return { deletedCount: result.deletedCount };
  } catch (error: any) {
    logger.error('Error invalidating all sessions:', error);
    throw new Error(`Failed to invalidate all sessions: ${error.message}`);
  }
};

/**
 * Invalidates all sessions for a user except the current one
 */
export const invalidateAllExceptCurrent = async (userId: string, ipAddress: string) => {
  try {
    // Find the current session to preserve
    const currentSession = await SessionModel.findOne({ userId, ipAddress });
    if (!currentSession) {
      throw new Error('Current session not found');
    }

    // Delete all other sessions for this user
    const result = await SessionModel.deleteMany({
      userId,
      sessionId: { $ne: currentSession.sessionId }
    });

    logger.info(`Invalidated ${result.deletedCount} other sessions for user ${userId}`);
    return { 
      deletedCount: result.deletedCount,
      currentSessionId: currentSession.sessionId
    };
  } catch (error: any) {
    logger.error('Error invalidating other sessions:', error);
    throw new Error(`Failed to invalidate other sessions: ${error.message}`);
  }
};

/**
 * Gets the active session for a user and IP address
 */
export const getActiveSession = async (userId: string, ipAddress: string) => {
  try {
    const session = await SessionModel.findOne({ 
      userId, 
      ipAddress,
      expiresAt: { $gt: new Date() } 
    });

    if (!session) {
      return null;
    }

    return session;
  } catch (error: any) {
    logger.error('Error getting active session:', error);
    throw new Error(`Failed to get active session: ${error.message}`);
  }
};

/**
 * Invalidates a specific session by ID
 */
export const invalidateSession = async (sessionId: string) => {
  try {
    const result = await SessionModel.deleteOne({ sessionId });
    
    if (result.deletedCount === 0) {
      throw new Error('Session not found');
    }
    
    logger.info(`Invalidated session ${sessionId}`);
    return { success: true };
  } catch (error: any) {
    logger.error(`Error invalidating session ${sessionId}:`, error);
    throw new Error(`Failed to invalidate session: ${error.message}`);
  }
};

/**
 * Verifies if a JWT token is valid
 * Optionally checks if the session still exists in the database
 */
export const verifyJwtToken = async (token: string, checkSessionExists = true) => {
  try {
    // Verify the token signature and expiration
    const payload = verifyToken(token);
    
    if (!payload) {
      throw new Error('Invalid or expired token');
    }

    // Check if the session still exists in the database if requested
    if (checkSessionExists) {
      const session = await SessionModel.findOne({ 
        sessionId: payload.sessionId,
        userId: payload.userId,
        expiresAt: { $gt: new Date() }
      });

      if (!session) {
        throw new Error('Session not found or expired');
      }
    }

    return {
      valid: true,
      userId: payload.userId,
      sessionId: payload.sessionId
    };
  } catch (error: any) {
    logger.error('Error verifying token:', error);
    return {
      valid: false,
      error: error.message
    };
  }
};
