"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { toast } from "sonner"

import { BackButton } from "@/components/auth/back-button"
import { AuthHeader } from "@/components/auth/auth-header"
import { StepIndicator } from "@/components/auth/step-indicator"
import { GoogleProfileDetails } from "@/components/auth/google-auth/profile-details"
import { UserTypeSelector } from "@/components/auth/user-type"
import { CustomerSignUp } from "@/components/auth/sign-up/customer-signup"
import { DriverSignUp } from "@/components/auth/sign-up/driver-signup"
import { RestaurantSignUp } from "@/components/auth/sign-up/restaurant-signup"

type UserType = "customer" | "driver" | "restaurant" | null

interface GoogleUserData {
  email: string
  firstName: string
  lastName: string
  profileImage: string | null
  userId?: string
}

export default function GoogleOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userData, setUserData] = useState<GoogleUserData>({
    email: "",
    firstName: "",
    lastName: "",
    profileImage: null
  })
  const [phone, setPhone] = useState("")
  const [userType, setUserType] = useState<UserType>(null)
  const [showUserTypeModal, setShowUserTypeModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)

  // Load Google data from localStorage on component mount
  useEffect(() => {
    const googleAuthDataString = typeof window !== 'undefined' 
      ? localStorage.getItem('googleAuthData') 
      : null
    
    if (googleAuthDataString) {
      try {
        const googleAuthData = JSON.parse(googleAuthDataString)
        
        // Check if we have the minimum required data
        if (!googleAuthData.email) {
          throw new Error('Missing email in Google auth data');
        }
        
        // Determine if we're in offline mode
        const isOfflineMode = !googleAuthData.userId?.includes('-') || googleAuthData.userId?.startsWith('google-');
        setOfflineMode(isOfflineMode);
        
        if (isOfflineMode) {
          console.log('Running in offline mode with directly fetched Google data');
        }
        
        setUserData({
          email: googleAuthData.email || "",
          firstName: googleAuthData.firstName || "",
          lastName: googleAuthData.lastName || "",
          profileImage: googleAuthData.profilePicture || null,
          userId: googleAuthData.userId || undefined
        })

        // If user type is already in the data, use it
        if (googleAuthData.userType) {
          const normalizedType = googleAuthData.userType.toLowerCase()
          if (normalizedType === 'customer' || normalizedType === 'driver' || normalizedType === 'restaurant') {
            setUserType(normalizedType as UserType)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error('Error parsing Google auth data:', error)
        // Show more specific error to user
        toast.error("Incomplete Google account data", {
          description: "We couldn't retrieve all your Google account information. Please try again."
        })
        // Redirect to regular sign-up if data is invalid
        router.push('/sign-up')
      }
    } else {
      // No Google data found, redirect to regular sign-up
      toast.error("No Google account data found", {
        description: "Please sign up using the regular form or try Google sign-in again."
      })
      router.push('/sign-up')
    }
  }, [router])

  const handleProfileDetailsSubmit = (phone: string) => {
    setPhone(phone)
    if (userType) {
      // If user type is already selected, go to specific form
      setStep(2)
    } else {
      // Otherwise show user type selector
      setShowUserTypeModal(true)
    }
  }

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    setShowUserTypeModal(false)
    setStep(2)
  }

  const handleCompleteRegistration = async (additionalData: any) => {
    // In offline mode, just simulate success and store the data
    if (offlineMode) {
      const completeUserData = {
        ...userData,
        phone,
        userType,
        ...additionalData,
        isOfflineRegistered: true
      };
      
      // Store the complete profile data for potential later sync
      localStorage.setItem('offlineUserData', JSON.stringify(completeUserData));
      
      // Show appropriate message to user
      toast.success("Profile created successfully", {
        description: "You're in offline mode. Your profile will be synced when connection is restored."
      });
      
      // Redirect based on user type
      if (userType) {
        router.push(`/${userType}`);
      } else {
        router.push('/dashboard');
      }
      return;
    }
    
    // Here you would normally send the data to your backend
    // For now we'll just redirect to the dashboard
    toast.success("Profile completed!", {
      description: "Your Google sign-in registration is now complete."
    });
    
    if (userType) {
      router.push(`/${userType}`);
    } else {
      router.push('/dashboard');
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Verify your Google account details"
      case 2:
        return `Complete your ${userType} profile`
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto bg-primary/30 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-primary/20 rounded mb-2"></div>
          <div className="h-3 w-32 bg-primary/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      {offlineMode && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ You are currently in offline mode. Your profile will be created locally and synchronized when your connection is restored.
          </p>
        </div>
      )}
    
      <BackButton
        href="/sign-in"
        onClick={step > 1 ? () => setStep(step - 1) : undefined}
        label={step === 1 ? "Back to Sign In" : "Back"}
      />

      <AuthHeader 
        title="Welcome to Food Ordering System" 
        subtitle={getStepTitle()} 
      />

      <StepIndicator
        steps={2}
        currentStep={step}
        onStepClick={(s) => {
          if (s < step) setStep(s)
        }}
      />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <GoogleProfileDetails
            userData={userData}
            onSubmit={handleProfileDetailsSubmit}
          />
        )}
        
        {step === 2 && (
          <>
            {userType === "customer" && (
              <CustomerSignUp
                userData={{
                  email: userData.email,
                  password: "", // Password not needed for Google auth
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  phone: phone,
                  profileImage: userData.profileImage,
                }}
                isGoogleAuth={true}
                onSubmitSuccess={handleCompleteRegistration}
              />
            )}

            {userType === "driver" && (
              <DriverSignUp
                userData={{
                  email: userData.email,
                  password: "", // Password not needed for Google auth
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  phone: phone,
                  profileImage: userData.profileImage,
                }}
                isGoogleAuth={true}
                onSubmitSuccess={handleCompleteRegistration}
              />
            )}

            {userType === "restaurant" && (
              <RestaurantSignUp
                userData={{
                  email: userData.email,
                  password: "", // Password not needed for Google auth
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  phone: phone,
                  profileImage: userData.profileImage,
                }}
                isGoogleAuth={true}
                onSubmitSuccess={handleCompleteRegistration}
              />
            )}
          </>
        )}
      </AnimatePresence>

      <UserTypeSelector
        isOpen={showUserTypeModal}
        onClose={() => setShowUserTypeModal(false)}
        onSelect={handleUserTypeSelect}
      />
    </>
  )
}