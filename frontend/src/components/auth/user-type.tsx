"use client"

import type React from "react"

import { motion } from "framer-motion"
import { User, Car, UtensilsCrossed } from "lucide-react"

import { Modal } from "@/components/auth/modal"

type UserType = "customer" | "driver" | "restaurant" | null

interface UserTypeOption {
  id: UserType
  title: string
  description: string
  icon: React.ReactNode
}

interface UserTypeSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: UserType) => void
}

export function UserTypeSelector({ isOpen, onClose, onSelect }: UserTypeSelectorProps) {
  const options: UserTypeOption[] = [
    {
      id: "customer",
      title: "Customer",
      description: "Order food from your favorite restaurants",
      icon: <User className="h-6 w-6" />,
    },
    {
      id: "driver",
      title: "Driver",
      description: "Deliver food and earn money",
      icon: <Car className="h-6 w-6" />,
    },
    {
      id: "restaurant",
      title: "Restaurant",
      description: "Sell your food to customers",
      icon: <UtensilsCrossed className="h-6 w-6" />,
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose User Type">
      <p className="text-muted-foreground mb-6 text-center">Select the type of account you want to create</p>

      <div className="space-y-4">
        {options.map((option, index) => (
          <motion.button
            key={option.id}
            className="w-full p-4 border-2 border-gray-200 rounded-xl flex items-center hover:border-primary hover:bg-primary/5 transition-colors"
            onClick={() => onSelect(option.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="p-3 rounded-full bg-primary/10 text-primary mr-4">{option.icon}</div>
            <div className="text-left">
              <h3 className="font-medium">{option.title}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </Modal>
  )
}
