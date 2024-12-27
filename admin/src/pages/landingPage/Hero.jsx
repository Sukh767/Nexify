import React from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../components/hooks/useParallax';

const Hero = () => {
  const [ref, parallaxY] = useParallax();

  const childVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="absolute inset-0 z-0 bg-black bg-opacity-40"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/991422/pexels-photo-991422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: parallaxY
        }}
      />
      <div className="relative z-10 text-center text-gray-50">
        <motion.img
          src="https://res.cloudinary.com/dbotqrsil/image/upload/v1735293076/Screenshot_from_2024-12-26_07-59-50_mgahgw.png"
          alt="Nexify Logo"
          className="w-48 mx-auto mb-8"
          variants={childVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        <motion.h1
          className="text-5xl font-black mb-4 font-serif"
          variants={childVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Nexify
        </motion.h1>
        <motion.p
          className="text-2xl mb-8 text-gray-50 font-semibold"
          variants={childVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Empowering Your E-Commerce Management with Precision and Ease
        </motion.p>
        <motion.button
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out"
          variants={childVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9, duration: 0.8 }}
          whileHover={{
            scale: 1.05,
            backgroundImage: 'linear-gradient(45deg, #4F46E5, #06B6D4)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            window.location.href = '/auth/login';
          }}
        >
          Login
        </motion.button>
      </div>
    </motion.section>
  );
};

export default Hero;

