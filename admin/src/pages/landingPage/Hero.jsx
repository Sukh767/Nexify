import React from "react";
import { motion } from "framer-motion";
import { useParallax } from "../../components/hooks/useParallax";

const Hero = () => {
  const [ref, parallaxY] = useParallax();

  const childVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
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
          backgroundImage:
            "url('https://img1.wallspic.com/crops/9/6/6/8/4/148669/148669-lake-highland-nature-sky-mountain-3840x2160.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          y: parallaxY,
        }}
      />
      <div className="relative z-10 text-center text-gray-50">
        <motion.img
          src="https://res.cloudinary.com/dbotqrsil/image/upload/v1735312794/output-onlinepngtools_wyph8a.png"
          alt="Nexify Logo"
          className="w-208 mx-auto mb-8"
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
          className="text-2xl mb-8 text-gray-50 font-bold text-opacity-50"
          variants={childVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Empowering Your E-Commerce Management with Precision and Ease
        </motion.p>
        <motion.button
          className="text-white px-8 py-3 text-lg font-semibold transition-all duration-300 ease-in-out"
          variants={childVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.9, duration: 0.8 }}
          whileHover={{
            scale: 1.05,
            //backgroundImage: 'linear-gradient(45deg, #4F46E5, #06B6D4)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            window.location.href = "/auth/login";
          }}
        >
          <button
            className="bg-white text-center w-48 h-14 relative text-black text-xl font-semibold group"
            type="button"
          >
            <div className="bg-emerald-700 h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
              >
                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
              </svg>
            </div>
            <p className="translate-x-2">LOGIN</p>
          </button>
        </motion.button>
      </div>
    </motion.section>
  );
};

export default Hero;
