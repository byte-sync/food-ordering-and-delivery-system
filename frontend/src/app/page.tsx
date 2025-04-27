"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserType, isAuthenticated } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      const userType = getUserType();

      if (userType) {
        // Redirect based on user type
        switch (userType.toLowerCase()) {
          case "admin":
            router.push("/admin");
            break;
          case "customer":
            router.push("/customer");
            break;
          case "restaurant":
            router.push("/restaurant");
            break;
          case "driver":
            router.push("/driver");
            break;
          default:
            router.push("/browse");
        }
      }
    }
  }, [router]);

  return (
    <div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>One</ResizablePanel>
        <ResizableHandle />
        <Button>Hello</Button>
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
