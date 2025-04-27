import axios from 'axios';

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const CLIENT_API = `${API_URL}/client`;

// Configure axios defaults
axios.defaults.withCredentials = true;

/**
 * Response interface for client information
 */
export interface ClientInfo {
  ip: string;
  userAgent: string;
  headers: {
    forwardedFor: string | null;
    realIp: string | null;
  };
  timestamp: string;
}

// Cache the client info to avoid unnecessary API calls
let cachedClientInfo: ClientInfo | null = null;

/**
 * Get client information including IP address from the backend
 * @param forceRefresh Whether to force a refresh of the cached info
 * @returns Promise resolving to client information
 */
export async function getClientInfo(forceRefresh = false): Promise<ClientInfo> {
  // Check if we have cached info and not forcing refresh
  if (!forceRefresh && cachedClientInfo) {
    return cachedClientInfo;
  }
  
  try {
    // Try to get IP from the backend service
    const response = await axios.get<ClientInfo>(`${CLIENT_API}/info`, {
      // Add a short timeout to avoid long waiting periods
      timeout: 2000
    });
    cachedClientInfo = response.data;
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch client IP, using fallback. Error:', error);
    
    // Return a fallback client info object if API call fails
    const fallbackInfo: ClientInfo = {
      ip: '127.0.0.1', // Default loopback address
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
      headers: {
        forwardedFor: null,
        realIp: null,
      },
      timestamp: new Date().toISOString(),
    };
    
    // Cache the fallback info to prevent further API calls
    cachedClientInfo = fallbackInfo;
    return fallbackInfo;
  }
}

/**
 * Utilities for client-side operations, including IP detection and device info
 */

import { getClientIp as fetchClientIp } from '@/utils/ip-address';

/**
 * Get the client's IP address with better error handling and fallback
 * @param forceRefresh Force a refresh of the IP (bypassing cache)
 * @returns Promise with the client's IP address
 */
export async function getClientIp(forceRefresh = false): Promise<string> {
  try {
    return await fetchClientIp(forceRefresh);
  } catch (error) {
    console.warn('Failed to get client IP address:', error);
    return '127.0.0.1';
  }
}

/**
 * Get device information for the current client
 * Useful for authentication and tracking
 */
export function getDeviceInfo(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }
  
  return navigator.userAgent;
}

/**
 * Check if we are running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if the current environment is localhost
 */
export function isLocalhost(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1';
}

/**
 * Check if the backend is likely running and available
 */
export async function isBackendAvailable(apiUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000) // 2 second timeout
    });
    
    return response.ok;
  } catch (error) {
    console.warn('Backend availability check failed:', error);
    return false;
  }
}