"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Mail, AlertCircle, Loader2 } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { FormInput } from "../form-input"
import { PasswordInput } from "../password-input"
import { SocialSignIn } from "./social-sign-in"
import api from "@/lib/axios"

interface AccountStepProps {
  onSubmit: (email: string, password: string, confirmPassword: string) => void
}

export function AccountStep({ onSubmit }: AccountStepProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [emailTimer, setEmailTimer] = useState<NodeJS.Timeout | null>(null)

  // Check if email already exists when email changes
  useEffect(() => {
    // Clear any existing error when email changes
    if (errors.email && errors.email === "This email is already in use") {
      setErrors(prev => ({ ...prev, email: undefined }));
    }

    // Clear previous timer
    if (emailTimer) {
      clearTimeout(emailTimer);
    }

    // Don't check if email is empty or invalid format
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return;
    }

    // Set a timer to prevent checking on every keystroke
    const timer = setTimeout(async () => {
      setCheckingEmail(true);
      try {
        // Define the expected response structure
        interface EmailExistsResponse {
          exists: boolean;
        }
        // Try to check if email exists via the users API endpoint
        const response = await api.get<EmailExistsResponse>(`/user-service/users/email/${email}/exists`);
        if (response.data && response.data.exists) {
          setErrors(prev => ({ ...prev, email: "This email is already in use" }));
        }
      } catch (error: any) {
        // If endpoint doesn't exist, still handle common error response patterns
        if (error.response?.status === 409 || 
            (error.response?.data?.error && error.response.data.error.includes("already exists"))) {
          setErrors(prev => ({ ...prev, email: "This email is already in use" }));
        }
      } finally {
        setCheckingEmail(false);
      }
    }, 500); // 500ms debounce
    
    setEmailTimer(timer);
    
    // Cleanup timer on component unmount
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [email]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Preserve email error if it's about existing email
    if (errors.email === "This email is already in use") {
      newErrors.email = errors.email;
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(email, password, confirmPassword)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.2,
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
      key="step1"
      onSubmit={handleSubmit}
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <FormInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={setEmail}
          error={errors.email === "This email is already in use" ? undefined : errors.email}
          icon={checkingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
        />
        {errors.email === "This email is already in use" && (
          <div className="mt-2 flex items-center text-sm text-destructive">
            <AlertCircle className="mr-1 h-4 w-4" />
            <span dangerouslySetInnerHTML={{ __html: "This email is already in use. <a href='/sign-in' class='underline'>Sign in instead?</a>" }}></span>
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <PasswordInput id="password" label="Password" value={password} onChange={setPassword} error={errors.password} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button type="submit" className="w-full" disabled={checkingEmail || errors.email === "This email is already in use"}>
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialSignIn onGoogleSignIn={() => console.log("Google sign in")} />
      </motion.div>
    </motion.form>
  )
}
