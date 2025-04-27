"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserType } from "@/services/auth-service";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: string | string[];
  fallbackPath?: string;
}

/**
 * A wrapper component for protecting routes based on user type
 * Redirects unauthorized users to fallbackPath (defaults to /unauthorized)
 * 
 * @example
 * // Only allow admins to access this page
 * <ProtectedRoute requiredUserType="admin">
 *   <AdminPage />
 * </ProtectedRoute>
 * 
 * @example
 * // Allow either customer or restaurant to access this page
 * <ProtectedRoute requiredUserType={["customer", "restaurant"]}>
 *   <SharedPage />
 * </ProtectedRoute>
 */
export function ProtectedRoute({
  children,
  requiredUserType,
  fallbackPath = "/unauthorized"
}: ProtectedRouteProps) {
  const router = useRouter();
  const userType = getUserType()?.toLowerCase();
  
  useEffect(() => {
    // If no user is logged in, redirect to sign in
    if (!userType) {
      router.push("/sign-in");
      return;
    }
    
    // If a specific user type is required
    if (requiredUserType) {
      const isAuthorized = Array.isArray(requiredUserType) 
        ? requiredUserType.includes(userType)
        : requiredUserType.toLowerCase() === userType;
        
      if (!isAuthorized) {
        router.push(fallbackPath);
      }
    }
  }, [router, userType, requiredUserType, fallbackPath]);
  
  return <>{children}</>;
}