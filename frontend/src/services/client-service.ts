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
  try {
    // Use cached info if available and not forcing refresh
    if (!forceRefresh && cachedClientInfo) {
      return cachedClientInfo;
    }
    
    const response = await axios.get<ClientInfo>(`${CLIENT_API}/info`);
    cachedClientInfo = response.data;
    return response.data;
  } catch (error) {
    console.error('Failed to fetch client info:', error);
    
    // Return a fallback client info object if API call fails
    return {
      ip: '127.0.0.1',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
      headers: {
        forwardedFor: null,
        realIp: null,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Get just the client IP address
 * @param forceRefresh Whether to force a refresh of the cached info
 * @returns Promise resolving to client IP address
 */
export async function getClientIp(forceRefresh = false): Promise<string> {
  const info = await getClientInfo(forceRefresh);
  return info.ip;
}