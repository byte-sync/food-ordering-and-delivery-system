"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  numInputs: number
  hasError?: boolean
  disabled?: boolean
}

export function OtpInput({ value, onChange, numInputs = 6, hasError = false, disabled = false }: OtpInputProps) {
  const [activeInput, setActiveInput] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const getOtpValue = () => (value ? value.toString().split("") : [])

  const changeCodeAtFocus = (value: string) => {
    const otp = getOtpValue()
    otp[activeInput] = value
    onChange(otp.join(""))

    if (value.length === 1 && activeInput < numInputs - 1) {
      focusInput(activeInput + 1)
    }
  }

  const focusInput = (inputIndex: number) => {
    const selectedIndex = Math.max(Math.min(numInputs - 1, inputIndex), 0)
    setActiveInput(selectedIndex)
    if (!disabled) {
      inputRefs.current[selectedIndex]?.focus()
    }
  }

  const handleOnFocus = (index: number) => {
    setActiveInput(index)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value
    if (val.length <= 1) {
      changeCodeAtFocus(val)
    }
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const pressedKey = e.key

    if (pressedKey === "Backspace" || pressedKey === "Delete") {
      e.preventDefault()
      const otp = getOtpValue()
      if (otp[activeInput]) {
        changeCodeAtFocus("")
      } else if (activeInput > 0) {
        focusInput(activeInput - 1)
        changeCodeAtFocus("")
      }
    } else if (pressedKey === "ArrowLeft") {
      e.preventDefault()
      focusInput(activeInput - 1)
    } else if (pressedKey === "ArrowRight") {
      e.preventDefault()
      focusInput(activeInput + 1)
    } else if (pressedKey === " " || pressedKey === "Spacebar" || pressedKey === "Space") {
      e.preventDefault()
    }
  }

  const handleOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return;
    
    const pastedData = e.clipboardData.getData("text/plain").trim().slice(0, numInputs).split("")

    if (pastedData) {
      let nextActiveInput = activeInput
      const updatedOTPValues = getOtpValue()

      updatedOTPValues.forEach((val, index) => {
        if (index >= activeInput && pastedData[index - activeInput]) {
          updatedOTPValues[index] = pastedData[index - activeInput]
          nextActiveInput = index + 1
        }
      })

      onChange(updatedOTPValues.join(""))
      setActiveInput(Math.min(nextActiveInput, numInputs - 1))
    }
  }

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs)
    if (!disabled) {
      focusInput(0)
    }
  }, [numInputs, disabled])

  const renderInputs = () => {
    const otp = getOtpValue()
    const inputs = []

    for (let i = 0; i < numInputs; i++) {
      inputs.push(
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="w-12 h-14"
        >
          <input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={1}
            className={`w-full h-full text-center text-xl font-semibold rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              hasError ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"
            } ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
            value={otp[i] || ""}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            onFocus={() => handleOnFocus(i)}
            onPaste={handleOnPaste}
            disabled={disabled}
          />
        </motion.div>,
      )
    }

    return inputs
  }

  return <div className="flex justify-between gap-2">{renderInputs()}</div>
}
