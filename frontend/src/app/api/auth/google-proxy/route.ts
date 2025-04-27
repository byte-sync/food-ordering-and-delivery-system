import { NextRequest, NextResponse } from 'next/server';

/**
 * This is a development-only proxy for Google API calls
 * It helps avoid CORS issues during local development when the backend is not available
 * In production, these calls should be made by your backend server
 */
export async function POST(request: NextRequest) {
  try {
    // Only allow this endpoint in development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }
    
    // Get the token from the request body
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 400 }
      );
    }
    
    // Call the Google API to get user info
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    if (!googleResponse.ok) {
      // Forward Google's error response
      const errorData = await googleResponse.json();
      console.error('Google API error:', errorData);
      return NextResponse.json(
        { error: 'Google API request failed', details: errorData },
        { status: googleResponse.status }
      );
    }
    
    // Return the Google user info
    const userData = await googleResponse.json();
    return NextResponse.json(userData);
    
  } catch (error: any) {
    console.error('Google proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy Google API request', message: error.message },
      { status: 500 }
    );
  }
}