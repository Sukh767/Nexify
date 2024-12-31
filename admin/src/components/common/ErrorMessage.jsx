import React from 'react'
import { motion } from 'framer-motion';

const ErrorMessage = ({message}) => {
  return (
    <motion.div
    className="flex items-center justify-center min-h-screen "
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="bg-gradient-to-br from-red-400 to-red-600 text-white p-4 shadow-lg max-w-md w-full"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <motion.p
        className="text-xl font-bold text-center text-white"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {message || "Something went wrong!, Please try later"}
      </motion.p>
    </motion.div>
  </motion.div>
  )
}

export default ErrorMessage