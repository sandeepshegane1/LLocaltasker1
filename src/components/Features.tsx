'use client'

import React from 'react'
import { MessageSquare, Calendar, DollarSign, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'

export function Features() {
  const features = [
    {
      icon: MessageSquare,
      title: "Efficient Communication",
      description: "Real-time messaging system for quick and easy coordination with service providers."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Automated scheduling system that considers availability and optimizes service timing."
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description: "Upfront cost estimates and standardized pricing for all services."
    },
    {
      icon: Navigation,
      title: "Real-Time Tracking",
      description: "Track your service provider's location and estimated arrival time."
    }
  ]

  return (
    <div className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Why Choose LocalTasker
        </motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-6 rounded-xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <feature.icon className="w-10 h-10 text-pink-400 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-indigo-200">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

