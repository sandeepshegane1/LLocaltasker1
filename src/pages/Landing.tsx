'use client'

import React, { useEffect,useState } from 'react'
import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { Testimonials } from '../components/Testimonials'
import { Footer } from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

export function Landing() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loader"
          className="fixed inset-0 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-40 h-40" viewBox="0 0 100 100">
            <motion.path
              d="M10,50 A40,40 0 1,1 90,50 A40,40 0 1,1 10,50"
              fill="none"
              stroke="#6366F1"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M20,50 A30,30 0 1,1 80,50 A30,30 0 1,1 20,50"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
            />
            <motion.path
              d="M30,50 A20,20 0 1,1 70,50 A20,20 0 1,1 30,50"
              fill="none"
              stroke="#EC4899"
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.4, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <Features />
          <Testimonials />
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

