import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

const Header = ({ isSidebarCollapsed }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <header
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg p-2 sm:p-3 md:p-4 border border-gray-700 rounded-full w-11/12 max-w-3xl transition-all duration-300 ease-in-out ${
        isSearchVisible && "sm:translate-x-0 sm:left-auto sm:right-4 sm:w-auto"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <AnimatePresence>
          {(isSearchVisible || window.innerWidth >= 768) && (
            <motion.div
              className={`relative flex items-center ${
                isSearchVisible ? "flex-grow" : "hidden sm:flex"
              }`}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                className="bg-gray-700 text-gray-100 p-2 pl-10 pr-4 rounded-full border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 text-sm w-full transition-all duration-300 ease-in-out"
                placeholder="Search here..."
              />
              <Search
                className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer transition duration-300"
                size={18}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Toggle for Small and Medium Screens */}
        <motion.button
          className={`ml-auto sm:hidden text-gray-300 hover:text-gray-100 focus:outline-none ${
            isSidebarCollapsed ? "mr-8" : "mr-4"
          }`}
          onClick={toggleSearch}
          animate={{ rotate: isSearchVisible ? 45 : 0 }}
        >
          {isSearchVisible ? <X size={24} /> : <Search size={24} />}
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
