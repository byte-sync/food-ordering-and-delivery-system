/**
 * Utility functions for handling client IP addresses
 * Uses server-side request-ip library through a dedicated endpoint
 */

// Default fallback IP for situations where we can't determine the real IP
const DEFAULT_IP = '127.0.0.1';

// Cache mechanism to avoid repeated API calls
let cachedClientIp: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Gets the client's IP address from our backend API that uses request-ip
 * @param forceRefresh Whether to bypass the cache and force a new API call
 * @returns A Promise that resolves to the client's IP address string
 */
export async function getClientIp(forceRefresh = false): Promise<string> {
  try {
    // Return cached IP if available and not expired
    const now = Date.now();
    if (!forceRefresh && cachedClientIp && (now - cacheTimestamp) < CACHE_DURATION) {
      return cachedClientIp;
    }

    // Call our backend API that uses request-ip
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const response = await fetch(`${API_URL}/client/info`, {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.ip) {
        // Update cache
        cachedClientIp = data.ip;
        cacheTimestamp = now;
        return data.ip;
      }
    }
    
    // Fallback 1: Try auth-service endpoint if available
    try {
      const authResponse = await fetch(`${API_URL}/auth-service/auth/client-ip`, {
        credentials: 'include'
      });
      
      if (authResponse.ok) {
        const authData = await authResponse.json();
        if (authData && authData.ip) {
          cachedClientIp = authData.ip;
          cacheTimestamp = now;
          return authData.ip;
        }
      }
    } catch (error) {
      console.log('Alternative IP endpoint failed');
    }
    
    // Fallback 2: Return cached IP if available (even if expired)
    if (cachedClientIp) {
      return cachedClientIp;
    }
    
    // Final fallback: return default IP
    return DEFAULT_IP;
  } catch (error) {
    console.error('Failed to get client IP:', error);
    
    // Return cached IP if available, otherwise default
    return cachedClientIp || DEFAULT_IP;
  }
}

/**
 * Gets basic client device information that can be useful for authentication
 * @returns Device information string (typically the user agent)
 */
export function getDeviceInfo(): string {
  if (typeof window !== 'undefined') {
    return navigator.userAgent;
  }
  return 'Unknown Device';
}