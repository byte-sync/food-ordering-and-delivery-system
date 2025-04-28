import { SessionModel } from '../model/session.model';
import logger from '../utils/logger';

/**
 * Service to clean up expired sessions from MongoDB
 */
export const cleanupExpiredSessions = async (): Promise<void> => {
  try {
    const currentDate = new Date();
    
    // Find expired sessions for logging purposes
    const expiredSessions = await SessionModel.find({
      expiresAt: { $lt: currentDate }
    });
    
    if (expiredSessions.length === 0) {
      logger.info('No expired sessions to clean up');
      return;
    }

    // Delete expired sessions
    const deleteResult = await SessionModel.deleteMany({
      expiresAt: { $lt: currentDate }
    });

    logger.info(`Cleaned up ${deleteResult.deletedCount} expired sessions`);
  } catch (error: any) {
    logger.error('Error cleaning up expired sessions:', error);
  }
};