'use client';

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 
        className={cn("text-zparez-blue", sizeClasses[size], className)} 
      />
    </motion.div>
  )
}

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3"
    >
      <Spinner size="lg" />
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-gray-600"
      >
        {message}
      </motion.p>
    </motion.div>
  )
}

interface FullPageLoaderProps {
  message?: string
}

export function FullPageLoader({ message = "Loading..." }: FullPageLoaderProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <Spinner size="lg" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 -z-10 rounded-full bg-zparez-blue/20 blur-xl"
          />
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium bg-gradient-to-r from-zparez-blue to-purple-600 bg-clip-text text-transparent"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  )
}

