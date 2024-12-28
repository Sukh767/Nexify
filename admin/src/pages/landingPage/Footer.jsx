import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1E201E] text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src="https://res.cloudinary.com/dbotqrsil/image/upload/v1735293076/Screenshot_from_2024-12-26_07-56-06_oo9tzm.png" alt="Nexify Logo" className="w-32 mb-4" />
            <p className="text-sm text-gray-400">Empowering Your E-Commerce Management with Precision and Ease</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <motion.a href="#" whileHover={{ y: -3 }} className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={24} />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -3 }} className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={24} />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -3 }} className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={24} />
              </motion.a>
              <motion.a href="#" whileHover={{ y: -3 }} className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={24} />
              </motion.a>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-400">Email: info@nexify.com</p>
              <p className="text-sm text-gray-400">Phone: +1 (123) 456-7890</p>
              <p className="text-sm text-gray-400">Address: 123 E-Commerce St, Digital City, 12345</p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; 2023 Nexify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

