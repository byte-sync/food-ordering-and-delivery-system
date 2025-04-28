"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Check, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/auth/back-button"
import { AuthHeader } from "@/components/auth/auth-header"
import { StepIndicator } from "@/components/auth/step-indicator"
import { OtpStep } from "@/components/auth/forgot-password/otp-step"
import { ResetPasswordStep } from "@/components/auth/forgot-password/reset-password"
import { Modal } from "@/components/auth/modal"
import { EmailStep } from "@/components/auth/forgot-password/email-step"
import { forgotPassword, verifyOtp, resetPassword } from "@/services/auth-service"
import { useRouter } from "next/navigation"

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", message: "", isError: false })

  const handleEmailSubmit = async (userEmail: string) => {
    setIsLoading(true);
    try {
      const response = await forgotPassword(userEmail);
      
      if (response.error) {
        setModalContent({
          title: "Request Failed",
          message: response.error,
          isError: true,
        });
        setShowModal(true);
        return;
      }
      
      // Success - go to OTP step
      setEmail(userEmail);
      setStep(2);
    } catch (error) {
      setModalContent({
        title: "Error",
        message: "Something went wrong. Please try again.",
        isError: true,
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOtpSubmit = async (userOtp: string) => {
    setIsLoading(true);
    try {
      const response = await verifyOtp(email, userOtp);
      
      if (response.error) {
        setModalContent({
          title: "Verification Failed",
          message: response.error,
          isError: true,
        });
        setShowModal(true);
        return;
      }
      
      // Success - go to reset password step
      setOtp(userOtp);
      setStep(3);
    } catch (error) {
      setModalContent({
        title: "Error",
        message: "Something went wrong. Please try again.",
        isError: true,
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setModalContent({
        title: "Success",
        message: "Verification code has been resent to your email.",
        isError: false,
      });
      setShowModal(true);
    } catch (error) {
      setModalContent({
        title: "Error",
        message: "Failed to resend verification code. Please try again.",
        isError: true,
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResetPassword = async (password: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      const response = await resetPassword(email, password);
      
      if (response.error) {
        setModalContent({
          title: "Reset Failed",
          message: response.error,
          isError: true,
        });
        setShowModal(true);
        return;
      }
      
      // Success
      setModalContent({
        title: "Success!",
        message: "Your password has been reset successfully.",
        isError: false,
      });
      setShowModal(true);
    } catch (error) {
      setModalContent({
        title: "Error",
        message: "Failed to reset password. Please try again.",
        isError: true,
      });
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  const closeModal = () => {
    setShowModal(false)
    if (!modalContent.isError && step === 3) {
      // Redirect to sign in page after successful password reset
      router.push('/sign-in');
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Enter your email to receive a verification code"
      case 2:
        return "Enter the 6-digit code sent to your email"
      case 3:
        return "Create a new password for your account"
      default:
        return ""
    }
  }

  return (
    <>
      <BackButton href="/sign-in" label="Back to Sign In" />

      <AuthHeader title="Reset Your Password" subtitle={getStepTitle()} />

      <StepIndicator steps={3} currentStep={step} onStepClick={setStep} />

      <AnimatePresence mode="wait">
        {step === 1 && <EmailStep onSubmit={handleEmailSubmit} disabled={isLoading} />}
        {step === 2 && <OtpStep onSubmit={handleOtpSubmit} onResendOtp={handleResendOtp} disabled={isLoading} />}
        {step === 3 && <ResetPasswordStep onSubmit={handleResetPassword} disabled={isLoading} />}
      </AnimatePresence>

      {isLoading && (
        <div className="flex justify-center mt-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={modalContent.title}
        icon={modalContent.isError ? AlertCircle : Check}
        iconClassName={modalContent.isError ? "text-red-500" : "text-green-500"}
      >
        <p className="text-center">{modalContent.message}</p>
        <Button onClick={closeModal} className="mt-4 w-full">
          {modalContent.isError ? "Try Again" : step === 3 ? "Go to Sign In" : "Continue"}
        </Button>
      </Modal>
    </>
  )
}
