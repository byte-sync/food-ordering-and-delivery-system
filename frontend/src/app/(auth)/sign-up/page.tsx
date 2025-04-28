"use client"

import { useState } from "react"
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
        {step === 1 && <AccountStep onSubmit={handleAccountSubmit} />}
        {step === 2 && <PersonalDetailsStep onSubmit={handlePersonalDetailsSubmit} />}
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
