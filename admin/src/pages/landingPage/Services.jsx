import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Settings, BarChart2, PhoneCall } from "lucide-react";

const services = [
  {
    title: "E-Commerce Solutions",
    description: "Comprehensive tools for online store management",
    icon: ShoppingCart,
  },
  {
    title: "Customizable Admin Panels",
    description: "Tailor-made dashboards for your specific needs",
    icon: Settings,
  },
  {
    title: "Advanced Analytics & Insights",
    description: "Data-driven decision making for your business",
    icon: BarChart2,
  },
  {
    title: "24/7 Support and Maintenance",
    description: "Round-the-clock assistance for your peace of mind",
    icon: PhoneCall,
  },
];

const ServiceCard = ({ title, description, icon: Icon }) => {
  return (
    <motion.div
      className="bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-semibold text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
};

const Services = () => {
  return (
    <section className="py-20 bg-gray-800">
    <div className="max-w-6xl mx-auto px-4">
      <motion.h2
        className="text-4xl font-bold text-center text-white mb-12"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Our Services
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <ServiceCard {...service} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Services;
