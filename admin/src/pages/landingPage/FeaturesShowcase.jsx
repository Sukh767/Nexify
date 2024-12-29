import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    title: 'Inventory Management',
    description: 'Seamless stock updates and tracking',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c'
  },
  {
    title: 'Order Tracking',
    description: 'Real-time analytics dashboard',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
  },
  {
    title: 'User Management',
    description: 'Secure user roles and permissions setup',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978'
  },
  {
    title: 'Sales Insights',
    description: 'Comprehensive graphs and charts for revenue insights',
    image: 'https://copilot-blog.ghost.io/content/images/2023/11/seo-reporting-dashboard.jpg'
  }
];

const FeatureCard = ({ title, description, image, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col md:flex-row items-center bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-12"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      <div className="md:w-1/2">
        <img src={image} alt={title} className="w-full h-64 object-cover" />
      </div>
      <div className="p-8 md:w-1/2">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

const FeaturesShowcase = () => {
  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} index={index} />
        ))}
      </div>
    </section>
  );
};

export default FeaturesShowcase;

