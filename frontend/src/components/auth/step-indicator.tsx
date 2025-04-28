"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface StepIndicatorProps {
  steps: number
  currentStep: number
  onStepClick?: (step: number) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex justify-center mb-8">
      {Array.from({ length: steps }).map((_, i) => {
        const stepNumber = i + 1
        return (
          <motion.div
            key={stepNumber}
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stepNumber === currentStep
                  ? "bg-primary text-white"
                  : stepNumber < currentStep
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-200 text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (stepNumber < currentStep && onStepClick) {
                  onStepClick(stepNumber)
                }
              }}
              style={{ cursor: stepNumber < currentStep && onStepClick ? "pointer" : "default" }}
            >
              {stepNumber < currentStep ? <Check className="h-4 w-4" /> : stepNumber}
            </motion.div>
            {stepNumber < steps && (
              <div className={`w-10 h-1 ${stepNumber < currentStep ? "bg-primary/60" : "bg-gray-200"}`} />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
