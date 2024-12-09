'use client'

import React from 'react'
import { Star } from 'lucide-react'
import { motion } from 'framer-motion'

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150",
      content: "LocalTasker made finding a reliable plumber so easy. The service was quick and professional!"
    },
    {
      name: "Michael Chen",
      role: "Property Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150",
      content: "As a property manager, LocalTasker has revolutionized how I handle maintenance requests."
    },
    {
      name: "Emily Rodriguez",
      role: "Service Provider",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150",
      content: "The platform has helped me grow my business and connect with new clients seamlessly."
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
          What Our Users Say
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <div className="flex items-center mb-4">
                <motion.img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div>
                  <h3 className="font-semibold text-white">{testimonial.name}</h3>
                  <p className="text-pink-300 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * i }}
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </motion.div>
                ))}
              </div>
              <p className="text-indigo-200">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

