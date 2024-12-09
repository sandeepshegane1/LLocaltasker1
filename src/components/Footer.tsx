'use client'

import React from 'react'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">LocalTasker</h3>
            <p className="text-indigo-200">Connecting local service providers with property owners for seamless maintenance solutions.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4 text-pink-300">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4 text-pink-300">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Plumbing</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Electrical</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Landscaping</a></li>
              <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Cleaning</a></li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4 text-pink-300">Follow Us</h4>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-indigo-200 hover:text-white transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          className="border-t border-indigo-800 mt-8 pt-8 text-center text-indigo-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>&copy; {new Date().getFullYear()} LocalTasker. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

