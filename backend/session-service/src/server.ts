import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import sessionRoutes from "./routes/session.route";
import { cleanupExpiredSessions } from './services/cleanup.service';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Apply middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/sessions', sessionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Set up session cleanup interval (default to every hour)
const CLEANUP_INTERVAL_MS = parseInt(process.env.CLEANUP_INTERVAL_MS || '', 10) || 60 * 60 * 1000;

const setupSessionCleanup = () => {
  // Run an initial cleanup
  cleanupExpiredSessions()
    .then(() => logger.info('Initial session cleanup completed'))
    .catch(err => logger.error('Initial session cleanup failed', err));
  
  // Schedule regular cleanups
  setInterval(() => {
    cleanupExpiredSessions()
      .catch(err => logger.error('Scheduled session cleanup failed', err));
  }, CLEANUP_INTERVAL_MS);
  
  logger.info(`Automatic session cleanup scheduled (every ${CLEANUP_INTERVAL_MS / (60 * 1000)} minutes)`);
};

// Start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Get port from environment or use default
    const PORT = process.env.PORT || 5003;
    
    // Start listening for requests
    app.listen(PORT, () => {
      logger.info(`Session service running on port ${PORT}`);
      setupSessionCleanup();
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Initialize the server
startServer();
