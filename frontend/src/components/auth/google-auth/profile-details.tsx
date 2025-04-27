"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Badge, Mail, User } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface GoogleUserData {
  email: string
  firstName: string
  lastName: string
  profileImage: string | null
  userId?: string
}

interface GoogleProfileDetailsProps {
  userData: GoogleUserData
  onSubmit: (phone: string) => void
}

export function GoogleProfileDetails({ userData, onSubmit }: GoogleProfileDetailsProps) {
  const [phone, setPhone] = useState("")
  const [errors, setErrors] = useState<{ phone?: string }>({})

  const validateForm = () => {
    const newErrors: { phone?: string } = {}

    if (!phone) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(phone)
    }
  }

  const initialsFromName = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
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
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex flex-col items-center space-y-4"
        variants={itemVariants}
      >
        <div className="relative">
          <Avatar className="h-24 w-24">
            {userData.profileImage ? (
              <AvatarImage src={userData.profileImage} alt={`${userData.firstName} ${userData.lastName}`} />
            ) : (
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {initialsFromName(userData.firstName, userData.lastName)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="absolute -bottom-1 -right-1">
            <Badge className="h-6 w-6 bg-accent rounded-full flex items-center justify-center p-0 border-2 border-background">
              <svg className="h-3 w-3" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
            </Badge>
          </div>
        </div>
        <h3 className="text-xl font-medium">{userData.firstName} {userData.lastName}</h3>
        <p className="text-sm text-muted-foreground">
          You&apos;ve logged in with your Google account.
        </p>
      </motion.div>

      <motion.div className="space-y-4" variants={itemVariants}>
        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              value={`${userData.firstName} ${userData.lastName}`}
              disabled
              className="bg-background/50 focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              value={userData.email}
              disabled
              className="bg-background/50 focus-visible:ring-0"
            />
          </div>
        </div>
      </motion.div>

      <motion.div className="space-y-2" variants={itemVariants}>
        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          Phone Number
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            placeholder="e.g., 0712345678"
            className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        <p className="text-xs text-muted-foreground">
          We need your phone number for account security and order notifications.
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </motion.div>
    </motion.form>
  )
}