'use client'

import React from 'react'
import { ArrowRight, Shield, Clock, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 text-white">
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,0 C20,20 50,20 100,0 L100,100 L0,100 Z"
            fill="rgba(255,255,255,0.1)"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.path
            d="M0,100 C30,80 70,80 100,100 L100,0 L0,0 Z"
            fill="rgba(255,255,255,0.05)"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Find Local Service Providers
            <motion.span
              className="block text-4xl md:text-6xl mt-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              Instantly
            </motion.span>
          </h1>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Connect with trusted local professionals for all your property maintenance needs through our AI-powered matching system.
          </p>
          <motion.button
            className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-yellow-600 transition-all duration-300 flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
        
        <motion.div
          className="mt-20 grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {[
            {
              icon: Shield,
              title: "Verified Providers",
              description: "All service providers are thoroughly vetted and verified"
            },
            {
              icon: Clock,
              title: "Quick Matching",
              description: "Get matched with the right professional in minutes"
            },
            {
              icon: MapPin,
              title: "Local Experts",
              description: "Find skilled professionals in your neighborhood"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <feature.icon className="w-12 h-12 text-pink-400 mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-indigo-200">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

