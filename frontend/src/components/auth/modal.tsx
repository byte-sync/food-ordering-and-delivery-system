"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  icon?: LucideIcon
  iconClassName?: string
}

export function Modal({ isOpen, onClose, title, children, icon: Icon, iconClassName }: ModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <motion.div
              className="bg-white rounded-2xl shadow-lg w-full max-w-md pointer-events-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  {title && <h2 className="text-xl font-semibold">{title}</h2>}
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                {Icon && (
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full bg-gray-100 ${iconClassName}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                )}

                <div>{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
