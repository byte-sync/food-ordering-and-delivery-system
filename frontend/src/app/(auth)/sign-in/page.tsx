"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { AuthHeader } from "@/components/auth/auth-header"
import { SignInForm } from "@/components/auth/sign-in-form"
import { userService } from "@/services/user-service"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Call the login function from userService
      const result = await userService.login(email, password)
      
      // Get user type from response
      const userType = result.userType
      console.log('User type from login:', userType)
      
      if (userType) {
        // User type is already normalized to lowercase in the login function
        
        // Show success message
        toast.success("Successfully signed in!", {
          description: `Welcome back to our food ordering platform.`,
        })
        
        // Redirect based on user type
        console.log('Redirecting to:', `/${userType}`)
        
        // Direct routing based on user type
        router.push(`/${userType}`)
      } else {
        // No user type found
        console.log('No user type found, redirecting to dashboard')
        
        toast.success("Successfully signed in!", {
          description: "Welcome back to our food ordering platform.",
        })
        
        router.push("/dashboard")
      }
    } catch (error: any) {
      // Show error message
      const errorMessage = error.response?.data?.message || "Failed to sign in. Please try again."
      toast.error("Authentication failed", {
        description: errorMessage,
      })
      console.error("Login error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthHeader title="Welcome back" subtitle="Sign in to your account to continue" />
      <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
    </>
  )
}
