"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { FormInput } from "./form-input"

interface PasswordInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
}

export function PasswordInput({ id, label, value, onChange, error, placeholder = "••••••••", disabled }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormInput
      id={id}
      label={label}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      icon={<Lock className="h-4 w-4" />}
      className="pr-10"
      disabled={disabled}
      suffix={
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      }
    />
  )
}
