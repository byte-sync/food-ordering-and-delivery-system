import { Request, Response } from 'express';
import { getClientInfo } from '../utils/client-ip';

/**
 * Get the client's IP address and related information
 * @param req Express request object
 * @param res Express response object
 */
export const getClientInformation = (req: Request, res: Response): void => {
  try {
    const clientInfo = getClientInfo(req);
    
    // Set CORS headers to allow access from frontend
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    res.status(200).json(clientInfo);
  } catch (error) {
    console.error('Error getting client information:', error);
    res.status(500).json({ error: 'Failed to retrieve client information' });
  }
};