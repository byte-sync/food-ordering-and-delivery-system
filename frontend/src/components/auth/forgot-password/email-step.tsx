"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Mail, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormInput } from "../form-input"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/validators/auth"

interface EmailStepProps {
  onSubmit: (email: string) => void
  disabled?: boolean
}

export function EmailStep({ onSubmit, disabled = false }: EmailStepProps) {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<{ email?: string }>({})

  const validateEmail = () => {
    try {
      forgotPasswordSchema.parse({ email });
      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors = error.format ? error.format() : {};
      setErrors({
        email: formattedErrors.email?._errors[0] || "Invalid email"
      });
      return false;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateEmail()) {
      onSubmit(email)
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
          error={errors.email}
          icon={<Mail className="h-4 w-4" />}
          disabled={disabled}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button type="submit" className="w-full" disabled={disabled}>
          {disabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Send Verification Code
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  )
}
