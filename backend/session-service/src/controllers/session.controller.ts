import { Request, Response } from 'express';
import { 
  createOrExtendSession, 
  invalidateSession, 
  invalidateAllSessions,
  invalidateAllExceptCurrent,
  getActiveSession,
  verifyJwtToken
} from '../services/session.service';
import { 
  CreateSessionSchema, 
  InvalidateSessionSchema,
  InvalidateUserSessionsSchema,
  InvalidateExceptCurrentSchema,
  GetActiveSessionSchema,
  VerifyTokenSchema
} from '../validators/session.schema';
import logger from '../utils/logger';

/**
 * Creates or extends a session for a user
 */
export const createSession = async (req: Request, res: Response) => {
  // TODO: Undefined Session
  try {
    const { userId, device, ipAddress } = CreateSessionSchema.parse(req.body);
    
    const result = await createOrExtendSession(userId, ipAddress, device);
    
    res.status(201).json({
      success: true,
      sessionId: result.sessionId,
      token: result.token,
      expiresAt: result.expiresAt
    });
  } catch (error: any) {
    logger.error('Create session error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    });
  }
};

/**
 * Invalidates a specific session
 */
export const invalidateSessionById = async (req: Request, res: Response) => {
  try {
    const { sessionId } = InvalidateSessionSchema.parse(req.body);
    
    await invalidateSession(sessionId);
    
    res.status(200).json({
      success: true,
      message: 'Session invalidated successfully'
    });
  } catch (error: any) {
    logger.error('Invalidate session error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    });
  }
};

/**
 * Invalidates all sessions for a specific user
 */
export const invalidateUserSessions = async (req: Request, res: Response) => {
  try {
    const { userId } = InvalidateUserSessionsSchema.parse(req.body);
    
    const result = await invalidateAllSessions(userId);
    
    res.status(200).json({
      success: true,
      message: `All sessions invalidated for user ${userId}`,
      count: result.deletedCount
    });
  } catch (error: any) {
    logger.error('Invalidate all sessions error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    });
  }
};

/**
 * Invalidates all sessions for a user except the current one
 */
export const invalidateOtherSessions = async (req: Request, res: Response) => {
  try {
    const { userId, ipAddress } = InvalidateExceptCurrentSchema.parse(req.body);
    
    const result = await invalidateAllExceptCurrent(userId, ipAddress);
    
    res.status(200).json({
      success: true,
      message: `Other sessions invalidated for user ${userId}`,
      currentSessionId: result.currentSessionId,
      count: result.deletedCount
    });
  } catch (error: any) {
    logger.error('Invalidate other sessions error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    });
  }
};

/**
 * Gets active session for a user and IP address
 */
export const getActiveUserSession = async (req: Request, res: Response) => {
  try {
    const { userId, ipAddress } = GetActiveSessionSchema.parse(req.body);
    
    const session = await getActiveSession(userId, ipAddress);
    
    if (!session) {
      res.status(404).json({
        success: false,
        error: 'No active session found'
      });
    } else {
      res.status(200).json({
        success: true,
        session: {
          sessionId: session.sessionId,
          userId: session.userId,
          device: session.device,
          ipAddress: session.ipAddress,
          expiresAt: session.expiresAt,
          createdAt: session.createdAt
        }
      });
    }
  } catch (error: any) {
    logger.error('Get active session error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    });
  }
};

/**
 * Verifies a JWT token
 */
export const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token } = VerifyTokenSchema.parse(req.body);
    
    const result = await verifyJwtToken(token);
    
    if (!result.valid) {
      res.status(401).json({
        success: false,
        error: result.error
      });
    } else {
      res.status(200).json({
        success: true,
        userId: result.userId,
        sessionId: result.sessionId
      });
    }
  } catch (error: any) {
    logger.error('Verify token error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    });
  }
};
