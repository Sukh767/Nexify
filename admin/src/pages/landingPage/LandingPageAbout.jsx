import React from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../components/hooks/useParallax';

const About = () => {
  const [ref, parallaxY] = useParallax();

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/2473183/pexels-photo-2473183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          y: parallaxY
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-white">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          About Nexify
        </motion.h2>
        <motion.p
          className="text-lg mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          At Nexify, we revolutionize e-commerce operations by providing cutting-edge solutions for managing your store effectively and efficiently. Our admin panel is crafted to simplify complex tasks while ensuring scalability and top-notch performance.
        </motion.p>
        <motion.div
          className="flex justify-center space-x-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">Our Vision</h3>
            <p>Empowering e-commerce businesses worldwide</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">Our Values</h3>
            <p>Innovation, Reliability, Customer-First</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

