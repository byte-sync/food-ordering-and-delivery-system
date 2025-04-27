"use client"

import { ReactNode } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex flex-col w-1/2 bg-primary p-10 text-white">
        <div className="flex items-center mb-8">
          <Image 
            src="/logo-white.svg" 
            alt="HungryNow Logo" 
            width={180} 
            height={50}
            priority
          />
        </div>
        <motion.div 
          className="flex-grow flex flex-col justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold mb-4">Complete Your Profile</h1>
          <p className="text-xl opacity-90">
            Just a few more steps to personalize your experience.
          </p>
        </motion.div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col">
        <div className="md:hidden p-6">
          <Image 
            src="/logo-colored.svg" 
            alt="HungryNow Logo" 
            width={150} 
            height={40}
            priority
          />
        </div>
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}