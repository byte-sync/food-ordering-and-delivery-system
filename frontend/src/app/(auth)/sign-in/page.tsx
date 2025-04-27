"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"

import { AuthHeader } from "@/components/auth/auth-header"
import { SignInForm } from "@/components/auth/sign-in-form"
import { userService } from "@/services/user-service"
import { googleSignIn } from "@/services/auth-service"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  // Move the useGoogleLogin hook to the top level of the component
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google login success, received token")
      processGoogleAuth(tokenResponse.access_token)
    },
    onError: (error) => {
      console.error("Google login failed", error)
      toast.error("Google Authentication failed", {
        description: "Could not authenticate with Google. Please try again.",
      })
      setIsGoogleLoading(false)
    },
  })

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

  // Handle Google sign-in - simplified to just set loading state and trigger the login
  const handleGoogleSignIn = async () => {
    console.log('Starting Google sign-in process')
    setIsGoogleLoading(true)
    try {
      // Trigger Google login flow using the hook defined at the top level
      googleLogin()
    } catch (error: any) {
      const errorMessage = error.message || "Failed to sign in with Google. Please try again."
      toast.error("Google Authentication failed", {
        description: errorMessage,
      })
      console.error("Google login error:", error)
      setIsGoogleLoading(false)
    }
  }
  
  // Process Google authentication after receiving token
  const processGoogleAuth = async (token: string) => {
    try {
      // Call the Google sign-in function
      const result = await googleSignIn(token)
      
      console.log('Google sign-in result received:', {
        success: !result.error,
        userType: result.userType,
        profileIncomplete: result.profileIncomplete
      })
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Check if profile is incomplete - from the direct response
      if (result.profileIncomplete) {
        // Store the user data in localStorage for the onboarding flow
        localStorage.setItem('googleAuthData', JSON.stringify({
          email: result.email || '',
          userId: result.userId || '',
          userType: result.userType?.toLowerCase() || '',
          firstName: result.firstName || '',
          lastName: result.lastName || '',
          profilePicture: result.profilePicture || '',
          isGoogleUser: true
        }))
        
        // Redirect to the new Google onboarding page
        toast.info("Please complete your profile", {
          description: `We need some additional details to set up your account.`,
        })
        router.push('/google-onboarding')
        return
      }
      
      // Normal authentication flow for returning users
      const userType = result.userType?.toLowerCase()
      console.log('User type from Google login:', userType)
      
      if (userType) {
        toast.success("Successfully signed in with Google!", {
          description: `Welcome to our food ordering platform.`,
        })
        router.push(`/${userType}`)
      } else {
        console.log('No user type found, redirecting to dashboard')
        toast.success("Successfully signed in with Google!", {
          description: "Welcome to our food ordering platform.",
        })
        router.push("/dashboard")
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to sign in with Google. Please try again."
      toast.error("Google Authentication failed", {
        description: errorMessage,
      })
      console.error("Google login error:", error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <>
      <AuthHeader title="Welcome back" subtitle="Sign in to your account to continue" />
      <SignInForm 
        onSubmit={handleSignIn} 
        onGoogleSignIn={handleGoogleSignIn}
        isLoading={isLoading || isGoogleLoading} 
      />
    </>
  )
}
