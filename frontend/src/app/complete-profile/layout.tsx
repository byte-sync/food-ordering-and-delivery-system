import { ReactNode } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";

interface ProfileCompletionLayoutProps {
  children: ReactNode;
}

export default function ProfileCompletionLayout({
  children,
}: ProfileCompletionLayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}