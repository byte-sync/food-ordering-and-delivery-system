import axios from 'axios';
import { ForgotPasswordFormData, LoginFormData, NewPasswordFormData, RegistrationFormData } from '@/validators/auth';
import { getClientIp } from '@/services/client-service';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

// Updated API URL configuration to ensure consistent endpoint handling
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const AUTH_API = `${API_URL}/auth-service/auth`;

// Configure axios defaults for CORS handling
axios.defaults.withCredentials = true;

// Interface for authentication responses
interface AuthResponse {
  message: string;
  userId?: string;
  sessionId?: string;
  token?: string;
  success?: boolean;
  error?: string;
  userType?: string;
}

export async function signIn(data: LoginFormData): Promise<AuthResponse> {
  try {
    // Get IP address and device info using our client service
    const device = navigator.userAgent;
    const ipAddress = await getClientIp();

    const response = await axios.post<AuthResponse>(`${AUTH_API}/sign-in`, {
      ...data,
      device,
      ipAddress,
    });

    // Debug log to identify the response structure
    console.log('Auth API Response:', {
      token: response.data.token,
      userId: response.data.userId,
      sessionId: response.data.sessionId,
      userType: response.data.userType
    });

    // Store auth data in localStorage
    if (response.data.token && response.data.userId && response.data.userType) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userType', response.data.userType.toLowerCase());
        
        // Also store sessionId if available
        if (response.data.sessionId) {
          localStorage.setItem('sessionId', response.data.sessionId);
        }
      }

      // Also set cookies for server-side auth (middleware)
      setCookie('authToken', response.data.token, { 
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/' 
      });
      setCookie('userId', response.data.userId, { 
        maxAge: 30 * 24 * 60 * 60,
        path: '/' 
      });
      setCookie('userType', response.data.userType.toLowerCase(), { 
        maxAge: 30 * 24 * 60 * 60,
        path: '/' 
      });
      
      // Store sessionId in cookie if available
      if (response.data.sessionId) {
        setCookie('sessionId', response.data.sessionId, { 
          maxAge: 30 * 24 * 60 * 60,
          path: '/' 
        });
      }
    }

    return response.data;
  } catch (error: any) {
    return {
      message: 'Authentication failed',
      error: error.response?.data?.error || error.message,
    };
  }
}

export async function signUp(data: RegistrationFormData): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(`${AUTH_API}/sign-up`, data);
    return response.data;
  } catch (error: any) {
    return {
      message: 'Registration failed',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Request password reset
export async function forgotPassword(email: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(`${AUTH_API}/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    return {
      message: 'Failed to process password reset request',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Verify OTP
export async function verifyOtp(email: string, otp: string): Promise<AuthResponse> {
  try {
    const response = await axios.post<AuthResponse>(`${AUTH_API}/verify-otp`, { email, otp });
    return response.data;
  } catch (error: any) {
    return {
      message: 'OTP verification failed',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Reset password with OTP
export async function resetPassword(email: string, newPassword: string): Promise<AuthResponse> {
  try {
    // Get IP address using our client service
    const ipAddress = await getClientIp();
    
    const response = await axios.post<AuthResponse>(`${AUTH_API}/reset-password`, {
      email,
      newPassword,
      ipAddress,
    });
    return response.data;
  } catch (error: any) {
    console.error('Reset password error:', error.response?.data || error);
    return {
      message: 'Password reset failed',
      error: error.response?.data?.error || error.message,
    };
  }
}

// Log out user
export function signOut(): void {
  // Clear localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('sessionId'); // Remove sessionId from localStorage
  }

  // Clear cookies
  deleteCookie('authToken');
  deleteCookie('userId');
  deleteCookie('userType');
  deleteCookie('sessionId'); // Remove sessionId from cookies
  
  console.log('User signed out');
}

/**
 * Check if the user is authenticated
 * @returns boolean indicating whether the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Check for auth token in cookie or localStorage
  const token = getCookie('authToken') || localStorage.getItem('authToken');
  return !!token;
};

/**
 * Get the current user's type (admin, customer, restaurant, driver)
 * @returns string representing the user type, or undefined if not found
 */
export const getUserType = (): string | undefined => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  // Try to get user type from cookie first, then fallback to localStorage
  const userType = getCookie('userType') || localStorage.getItem('userType');
  return userType?.toString().toLowerCase();
};

/**
 * Check if the current user has the required user type
 * @param requiredType - Required user type or array of allowed user types
 * @returns boolean indicating whether the user has the required type
 */
export const hasUserType = (requiredType: string | string[]): boolean => {
  const currentUserType = getUserType();
  if (!currentUserType) return false;
  
  if (Array.isArray(requiredType)) {
    return requiredType.map(t => t.toLowerCase()).includes(currentUserType.toLowerCase());
  }
  
  return currentUserType.toLowerCase() === requiredType.toLowerCase();
};

/**
 * Check if a route is accessible to the current user
 * @param route - Route to check access for
 * @returns boolean indicating whether the user can access the route
 */
export const canAccessRoute = (route: string): boolean => {
  // Extract the root path segment
  const pathSegment = route.split('/')[1].toLowerCase();
  const userType = getUserType();
  
  // Map of routes to required user types
  const routePermissions: Record<string, string> = {
    'admin': 'admin',
    'customer': 'customer',
    'restaurant': 'restaurant',
    'driver': 'driver',
  };
  
  const requiredType = routePermissions[pathSegment];
  
  // If no specific requirement for this route, or user type matches requirement
  if (!requiredType || !userType) {
    return true;
  }
  
  return userType === requiredType;
};