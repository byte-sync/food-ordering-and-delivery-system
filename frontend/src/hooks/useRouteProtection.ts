import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserType } from "@/services/auth-service";

// Map of routes to the user types that can access them
const PROTECTED_ROUTES: Record<string, string> = {
  '/admin': 'admin',
  '/customer': 'customer',
  '/restaurant': 'restaurant',
  '/driver': 'driver',
};

/**
 * Hook to protect routes at the client side
 * Prevents unauthorized navigation to protected routes
 */
export function useRouteProtection() {
  const router = useRouter();
  const userType = getUserType()?.toLowerCase();
  
  useEffect(() => {
    if (!userType) return;
    
    // Check if current path is authorized
    const currentPath = window.location.pathname;
    const routePrefix = `/${currentPath.split('/')[1]}`;
    const requiredUserType = PROTECTED_ROUTES[routePrefix];
    
    if (requiredUserType && userType !== requiredUserType) {
      console.log(`Unauthorized access: ${userType} on ${routePrefix}`);
      router.push('/unauthorized');
      return;
    }
    
    // Handle route changes via history API
    const handleRouteChange = (url: string) => {
      // Check if URL is a relative URL (starts with /)
      if (!url.startsWith('/')) return true;
      
      const pathPrefix = `/${url.split('/')[1]}`;
      const neededUserType = PROTECTED_ROUTES[pathPrefix];
      
      if (neededUserType && userType !== neededUserType) {
        console.log(`Preventing navigation: ${userType} trying to access ${pathPrefix}`);
        router.push('/unauthorized');
        return false;
      }
      
      return true;
    };
    
    // Intercept history.pushState
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
      if (url && typeof url === 'string' && !handleRouteChange(url)) {
        return;
      }
      return originalPushState.apply(history, [state, title, url as string]);
    };
    
    // Intercept link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('/')) {
          if (!handleRouteChange(href)) {
            e.preventDefault();
          }
        }
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      history.pushState = originalPushState;
      document.removeEventListener('click', handleClick);
    };
  }, [router, userType]);
}