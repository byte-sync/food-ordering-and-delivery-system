"use client"

import { motion } from "framer-motion"

interface AuthHeaderProps {
  title: string
  subtitle: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <motion.div
      className="space-y-2 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </motion.div>
  )
}
