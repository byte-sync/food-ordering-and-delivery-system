import axios from 'axios';
import { ForgotPasswordFormData, LoginFormData, NewPasswordFormData, RegistrationFormData } from '@/validators/auth';
import { getClientIp } from '@/services/client-service';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { toast } from "sonner";

// Updated API URL configuration to ensure consistent endpoint handling
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const AUTH_API = `${API_URL}/auth-service/auth`;
const USER_API = `${API_URL}/user-service/user`;

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
  email?: string;
  profileIncomplete?: boolean;
  isNewUser?: boolean;
}

export interface GoogleAuthResponse {
  userId?: string;
  token?: string;
  sessionId?: string;
  userType?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  profileIncomplete?: boolean;
  isNewUser?: boolean;
  error?: string;
}

export async function signIn(data: LoginFormData): Promise<AuthResponse> {
  try {
    // Get device info
    const device = navigator.userAgent;
    // Get IP address with a fallback value in case of error
    let ipAddress = '127.0.0.1'; // Default fallback
    
    try {
      // Try to get the client IP, but don't let this fail the whole sign-in process
      ipAddress = await getClientIp();
    } catch (ipError) {
      console.warn('Failed to get client IP for sign-in, using fallback:', ipError);
      // Continue with the default fallback IP
    }

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
    // Get IP address with a fallback value in case of error
    let ipAddress = '127.0.0.1'; // Default fallback
    
    try {
      // Try to get the client IP, but don't let this fail the password reset process
      ipAddress = await getClientIp();
    } catch (ipError) {
      console.warn('Failed to get client IP for password reset, using fallback:', ipError);
      // Continue with the default fallback IP
    }
    
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

/**
 * Authenticate with Google by sending the token to our backend
 * @param token Google auth token
 * @returns Authentication response
 */

// Define an interface for the Google user info structure
interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub: string; // Google's unique ID for the user
}

export async function googleSignIn(token: string): Promise<GoogleAuthResponse> {
  try {
    const device = navigator.userAgent;
    // Get IP address with a fallback value in case of error
    let ipAddress = '127.0.0.1'; // Default fallback
    
    try {
      // Try to get the client IP, but don't let this fail the whole sign-in process
      ipAddress = await getClientIp();
    } catch (ipError) {
      console.warn('Failed to get client IP for Google sign-in, using fallback:', ipError);
    }

    // Check for development mode or API connectivity issues
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isLocalHost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    );
    
    // Try to connect to the backend's authentication service
    try {
      // First attempt a ping to see if backend is available
      await fetch(`${AUTH_API}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(1500)  // 1.5 second timeout
      });
      
      console.log('Sending Google token to backend:', `${AUTH_API}/google/token`);
      
      // If we're here, the backend is available, send the token to our backend
      const response = await fetch(`${AUTH_API}/google/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          device,
          ipAddress,
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}: ${response.statusText}`);
      }

      const data: GoogleAuthResponse = await response.json();
      
      // Extract response data
      const { 
        userId, 
        token: authToken, 
        sessionId, 
        userType,
        email,
        firstName,
        lastName,
        profilePicture,
        profileIncomplete,
        isNewUser
      } = data;

      console.log('Google auth success in auth-service:', { 
        userId, 
        hasToken: !!authToken,
        hasSessionId: !!sessionId,
        userType,
        email,
        firstName,
        lastName,
        profileIncomplete,
        isNewUser
      });

      // For complete profiles (existing users), store auth data in localStorage
      if (authToken && userId && userType && !profileIncomplete) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('userId', userId);
          localStorage.setItem('userType', userType.toLowerCase());
          
          // Also store sessionId if available
          if (sessionId) {
            localStorage.setItem('sessionId', sessionId);
          }
        }

        // Also set cookies for server-side auth
        setCookie('authToken', authToken, { 
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/' 
        });
        setCookie('userId', userId, { 
          maxAge: 30 * 24 * 60 * 60,
          path: '/' 
        });
        setCookie('userType', userType.toLowerCase(), { 
          maxAge: 30 * 24 * 60 * 60,
          path: '/' 
        });
        
        // Store sessionId in cookie if available
        if (sessionId) {
          setCookie('sessionId', sessionId, { 
            maxAge: 30 * 24 * 60 * 60,
            path: '/' 
          });
        }
      }

      // Store Google data in localStorage for the onboarding flow if needed
      if (profileIncomplete || isNewUser) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('googleAuthData', JSON.stringify({
            email: email || '',
            userId: userId || '',
            userType: userType?.toLowerCase() || '',
            firstName: firstName || '',
            lastName: lastName || '',
            profilePicture: profilePicture || '',
            isGoogleUser: true,
            profileIncomplete: true
          }));
        }
      }

      // Return the response data
      return data;
      
    } catch (backendError) {
      console.warn('Backend connection failed, trying development proxy:', backendError);
      
      if (isDevelopment && isLocalHost) {
        // In development mode, use a proxy approach for testing
        try {
          // Use a development proxy to avoid CORS issues during testing
          const proxyResponse = await fetch('/api/auth/google-proxy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
          });
          
          if (!proxyResponse.ok) {
            throw new Error(`Proxy responded with ${proxyResponse.status}`);
          }
          
          const googleUserInfo = await proxyResponse.json();
          
          if (!googleUserInfo.email) {
            throw new Error('Failed to get valid data from Google proxy');
          }
          
          // Create mock data for development testing
          const mockResponse: GoogleAuthResponse = {
            userId: `google-${googleUserInfo.sub}`,
            email: googleUserInfo.email,
            firstName: googleUserInfo.given_name || googleUserInfo.name?.split(' ')[0] || 'Test',
            lastName: googleUserInfo.family_name || googleUserInfo.name?.split(' ').slice(1).join(' ') || 'User',
            profilePicture: googleUserInfo.picture,
            profileIncomplete: true,
            isNewUser: true
          };
          
          // Store in localStorage for the onboarding flow
          if (typeof window !== 'undefined') {
            localStorage.setItem('googleAuthData', JSON.stringify(mockResponse));
          }
          
          return mockResponse;
        } catch (proxyError) {
          console.error('Proxy also failed:', proxyError);
          throw new Error('Failed to authenticate with Google. Backend services are unavailable.');
        }
      } else {
        // In production, we should not use the proxy workaround
        throw backendError;
      }
    }
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    return {
      error: error.message || 'Failed to authenticate with Google'
    };
  }
}

// Add a helper function to fetch Google user info directly from Google's API
async function fetchGoogleUserInfo(token: string): Promise<any | null> {
  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Google user info:', error);
    return null;
  }
}

/**
 * Check if the current user's profile is complete
 * @returns Whether the profile needs completion and user info
 */
export async function checkProfileCompletion(userId: string): Promise<{
  isComplete: boolean;
  userType: string;
  email?: string;
  missingFields?: string[];
}> {
  // Define the expected response structure
  interface ProfileCompletionResponse {
    isComplete: boolean;
    userType: string;
    email?: string;
    missingFields?: string[];
  }

  try {
    // Specify the expected response type in the axios call
    const response = await axios.get<ProfileCompletionResponse>(`${AUTH_API}/profile-completion/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Profile completion check error:', error.response?.data || error);
    throw new Error(error.response?.data?.error || 'Failed to check profile completion');
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
    localStorage.removeItem('email'); // Remove email from localStorage
    localStorage.removeItem('profileIncomplete'); // Remove profileIncomplete from localStorage
    localStorage.removeItem('isNewUser'); // Remove isNewUser from localStorage
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