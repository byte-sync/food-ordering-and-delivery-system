"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getUserType } from "@/services/auth-service";
import { useRouteProtection } from "@/hooks/useRouteProtection";

export default function UnauthorizedPage() {
  const router = useRouter();
  
  // Apply route protection
  useRouteProtection();
  
  // Get the user's current type to direct them to the appropriate homepage
  const userType = getUserType();
  const homePath = userType ? `/${userType}` : "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        
        <h1 className="mb-3 text-3xl font-bold">Access Denied</h1>
        
        <p className="mb-6 text-muted-foreground">
          You don't have permission to access this page. This area is restricted to authorized users only.
        </p>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link href={homePath}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}