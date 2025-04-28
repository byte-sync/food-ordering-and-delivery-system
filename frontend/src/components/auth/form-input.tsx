"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormInputProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  icon?: ReactNode
  suffix?: ReactNode
  className?: string
  disabled?: boolean
}

export function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  suffix,
  className,
  disabled,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">{icon}</div>}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`${icon ? "pl-10" : ""} ${error ? "border-red-500" : ""} ${className || ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        {suffix && <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>}
      </div>
      {error && (
        <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.p>
      )}
    </div>
  )
}
