"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/auth/modal"
import { MapSelector } from "@/components/ui/map-selector"
import { useAtom } from "jotai"
import { locationAtom, locationSelectedAtom, showMapAtom, toggleMapAtom } from "@/atoms/location-atoms"
import { userService } from "@/services/user-service"
import { toast } from "sonner"
import { useRouter } from "next/router"

interface CustomerSignUpProps {
  userData?: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    profileImage?: string | null
  }
  isGoogleAuth?: boolean
  onSubmitSuccess?: (additionalData: any) => void
}

export function CustomerSignUp({ 
  userData = { email: "", password: "", firstName: "", lastName: "", phone: "" },
  isGoogleAuth = false,
  onSubmitSuccess
}: CustomerSignUpProps) {
  const router = useRouter()

  // Use location atoms
  const [location] = useAtom(locationAtom)
  const [locationConfirmed, setLocationConfirmed] = useState(false)
  const [locationSelected] = useAtom(locationSelectedAtom)
  const [showMap] = useAtom(showMapAtom)
  const [, toggleMapState] = useAtom(toggleMapAtom)
  
  // Local state
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errors, setErrors] = useState<{ location?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  // Sync location confirmed state with atom
  useEffect(() => {
    setLocationConfirmed(locationSelected)
  }, [locationSelected])

  const validateLocation = () => {
    const newErrors: { location?: string } = {}

    if (!location.address) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateLocation()) return

    setIsLoading(true)

    const registrationData = {
      email: userData.email,
      password: isGoogleAuth ? undefined : userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      profilePictureUrl: userData.profileImage,
      location: { // Use the location object directly
        address: location.address,
        lat: location.lat,
        lng: location.lng,
      },
    } as const

    try {
      if (isGoogleAuth && onSubmitSuccess) {
        onSubmitSuccess({
          location: registrationData.location,
        })
        return
      }

      const result = await userService.register(registrationData as any, "customer")

      if (result.error) {
        toast.error("Registration failed", {
          description: result.error,
        })
      } else {
        toast.success("Registration successful", {
          description: "You can now sign in with your credentials.",
        })
        router.push("/sign-in")
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "An error occurred during registration."
      toast.error("Registration failed", {
        description: errorMsg,
      })
      console.error("Sign up error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <label htmlFor="location" className="text-sm font-medium">
            Your Delivery Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Select your delivery location"
              className={`pl-10 ${
                locationConfirmed ? "border-green-500" : errors.location ? "border-red-500" : ""
              }`}
              value={location.address}
              readOnly
            />
            {locationConfirmed && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
          {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
          
          <Button
            type="button"
            variant="outline"
            className="w-full mt-2 flex items-center justify-center"
            onClick={() => toggleMapState(true)}
          >
            <MapPin className="mr-2 h-4 w-4" />
            {locationConfirmed ? "Change Location" : "Select on Map"}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isGoogleAuth ? "Completing Setup..." : "Creating Account..."}
              </>
            ) : (
              isGoogleAuth ? "Complete Setup" : "Create Account"
            )}
          </Button>
        </motion.div>
      </motion.form>

      <Modal 
        isOpen={showMap} 
        onClose={() => toggleMapState(false)} 
        title="Select Delivery Address"
      >
        <div className="space-y-4">
          <MapSelector 
            height="350px" 
            onConfirmLocation={() => {
              toggleMapState(false)
              setLocationConfirmed(true)
            }} 
          />
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Account Created!"
        icon={Check}
        iconClassName="text-green-500"
      >
        <div className="text-center">
          <p className="mb-4">
            Your customer account has been created successfully! You can now enjoy ordering food from our platform.
          </p>
          <Button onClick={() => (window.location.href = "/customer/browse")} className="w-full">
            Start Browsing
          </Button>
        </div>
      </Modal>
    </>
  )
}
