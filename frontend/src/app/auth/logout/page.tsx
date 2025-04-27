"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/services/auth-service';
import { Loader2 } from 'lucide-react';
import { userService } from '@/services/user-service';

export default function LogoutPage() {
  const router = useRouter();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        // First call the session invalidation API
        await userService.logout();
        
        // Then clear local storage and cookies
        signOut();
        
        // Redirect to sign-in page
        setTimeout(() => {
          router.push('/sign-in');
        }, 1000);
      } catch (error) {
        console.error('Error during logout:', error);
        // Even if the API call fails, clear local storage and redirect
        signOut();
        router.push('/sign-in');
      }
    };
    
    performLogout();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-lg">Logging out...</p>
    </div>
  );
}