import React from 'react'
import { motion } from 'framer-motion';
import Hero from './landingPage/Hero';
import FeaturesShowcase from './landingPage/FeaturesShowcase';
import About from './landingPage/LandingPageAbout';
import Services from './landingPage/Services';
import Footer from './landingPage/Footer';

const LandingPage = () => {
    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 text-gray-50"
        >
          <Hero />
          <FeaturesShowcase />
          <About />
          <Services />
          <Footer />
        </motion.div>
      );
}

export default LandingPage