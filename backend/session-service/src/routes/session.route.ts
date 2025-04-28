import { Router } from 'express';
import { 
  createSession, 
  invalidateSessionById, 
  invalidateUserSessions,
  invalidateOtherSessions,
  getActiveUserSession,
  verifyToken
} from '../controllers/session.controller';

const router = Router();

// Create or extend a session
router.post('/create', createSession);

// Verify token
router.post('/verify', verifyToken);

// Get active session by userId and IP
router.post('/active', getActiveUserSession);

// Invalidate a specific session
router.post('/invalidate/session', invalidateSessionById);

// Invalidate all sessions for a user
router.post('/invalidate/user', invalidateUserSessions);

// Invalidate all sessions except current
router.post('/invalidate/other', invalidateOtherSessions);

export default router;
