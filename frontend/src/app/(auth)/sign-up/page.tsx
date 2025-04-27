"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { BackButton } from "@/components/auth/back-button"
import { AuthHeader } from "@/components/auth/auth-header"
import { StepIndicator } from "@/components/auth/step-indicator"
import { AccountStep } from "@/components/auth/sign-up/account-step"
import { PersonalDetailsStep } from "@/components/auth/sign-up/personal-details-step"
import { CustomerSignUp } from "@/components/auth/sign-up/customer-signup"
import { DriverSignUp } from "@/components/auth/sign-up/driver-signup"
import { RestaurantSignUp } from "@/components/auth/sign-up/restaurant-signup"
import { UserTypeSelector } from "@/components/auth/user-type"

interface CustomerSignUpProps {
  userData: {
    email: string
    firstName: string
    lastName: string
    phone: string
    profileImage: string | null
    password: string
  }
}

type UserType = "customer" | "driver" | "restaurant" | null

interface GoogleAuthData {
  email?: string
  userId?: string
  userType?: string
  firstName?: string
  lastName?: string
  profilePicture?: string
  isGoogleUser?: boolean
}

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [userType, setUserType] = useState<UserType>(null)
  const [showUserTypeModal, setShowUserTypeModal] = useState(false)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  // Check for Google auth data on component mount
  useEffect(() => {
    const googleAuthDataString = typeof window !== 'undefined' ? localStorage.getItem('googleAuthData') : null
    
    if (googleAuthDataString) {
      try {
        const googleAuthData: GoogleAuthData = JSON.parse(googleAuthDataString)
        
        // Pre-fill form with Google data
        if (googleAuthData.email) setEmail(googleAuthData.email)
        if (googleAuthData.firstName) setFirstName(googleAuthData.firstName)
        if (googleAuthData.lastName) setLastName(googleAuthData.lastName)
        if (googleAuthData.profilePicture) setProfileImageUrl(googleAuthData.profilePicture)
        if (googleAuthData.userType) setUserType(googleAuthData.userType as UserType)
        
        // Mark as Google user - this will affect password handling since we don't need passwords for Google users
        if (googleAuthData.isGoogleUser) setIsGoogleUser(true)
        
        // Skip to appropriate step based on available data
        if (googleAuthData.email) {
          if (googleAuthData.firstName && googleAuthData.lastName) {
            if (googleAuthData.userType) {
              // We have all the basic info, go to the specific user type form
              setStep(3)
            } else {
              // We have personal details but need user type
              setStep(2)
              setShowUserTypeModal(true)
            }
          } else {
            // We have email but need personal details
            setStep(2)
          }
        }
        
        // Clean up after using the data
        localStorage.removeItem('googleAuthData')
      } catch (error) {
        console.error('Error parsing Google auth data:', error)
        localStorage.removeItem('googleAuthData')
      }
    }
  }, [])

  const handleAccountSubmit = (email: string, password: string, confirmPassword: string) => {
    setEmail(email)
    setPassword(password)
    setStep(2)
  }

  const handlePersonalDetailsSubmit = (
    firstName: string,
    lastName: string,
    phone: string,
    profileImage: string | null,
  ) => {
    setFirstName(firstName)
    setLastName(lastName)
    setPhone(phone)
    setProfileImageUrl(profileImage)
    setShowUserTypeModal(true)
  }

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    setShowUserTypeModal(false)
    setStep(3)
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Set up your account credentials"
      case 2:
        return "Tell us about yourself"
      case 3:
        return `Complete your ${userType} profile`
      default:
        return ""
    }
  }

  return (
    <>
      <BackButton
        href={step === 1 ? "/sign-in" : undefined}
        onClick={step > 1 ? () => setStep(step - 1) : undefined}
        label={step === 1 ? "Back to Sign In" : "Back"}
      />

      <AuthHeader title="Create an Account" subtitle={getStepTitle()} />

      <StepIndicator
        steps={3}
        currentStep={step}
        onStepClick={(s) => {
          if (s < step) setStep(s)
        }}
      />

      <AnimatePresence mode="wait">
        {step === 1 && <AccountStep onSubmit={handleAccountSubmit} googleUser={isGoogleUser} initialEmail={email} />}
        {step === 2 && (
          <PersonalDetailsStep 
            onSubmit={handlePersonalDetailsSubmit} 
            initialData={{ 
              firstName, 
              lastName, 
              phone, 
              profileImage: profileImageUrl 
            }} 
          />
        )}
        {step === 3 && (
          <>
            {userType === "customer" && (
              <CustomerSignUp
                userData={{
                  email,
                  password,
                  firstName,
                  lastName,
                  phone,
                  profileImage: profileImageUrl,
                }}
              />
            )}

            {userType === "driver" && (
              <DriverSignUp
                userData={{
                  email,
                  password,
                  firstName,
                  lastName,
                  phone,
                  profileImage: profileImageUrl,
                }}
              />
            )}

            {userType === "restaurant" && (
              <RestaurantSignUp
                userData={{
                  email,
                  password,
                  firstName,
                  lastName,
                  phone,
                  profileImage: profileImageUrl,
                }}
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
