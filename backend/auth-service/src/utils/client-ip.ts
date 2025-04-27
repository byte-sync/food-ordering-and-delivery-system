import { Request } from 'express';
import requestIp from 'request-ip';

/**
 * Get client IP address using request-ip library
 * @param req Express request object
 * @returns The client's IP address as a string
 */
export function getClientIp(req: Request): string {
  const ip = requestIp.getClientIp(req);
  return ip || '127.0.0.1'; // Return localhost as fallback
}

/**
 * Get detailed client information including IP address and headers
 * @param req Express request object
 * @returns An object with client information
 */
export function getClientInfo(req: Request): Record<string, any> {
  return {
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'] || 'Unknown',
    headers: {
      forwardedFor: req.headers['x-forwarded-for'] || null,
      realIp: req.headers['x-real-ip'] || null,
    },
    timestamp: new Date().toISOString(),
  };
}