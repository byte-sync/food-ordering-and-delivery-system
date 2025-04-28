"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface BackButtonProps {
  href?: string
  onClick?: () => void
  label?: string
}

export function BackButton({ href, onClick, label = "Back" }: BackButtonProps) {
  const content = (
    <div className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </div>
  )

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {href ? (
        <Link href={href}>{content}</Link>
      ) : (
        <button type="button" onClick={onClick}>
          {content}
        </button>
      )}
    </motion.div>
  )
}
