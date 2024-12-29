import { Search } from "lucide-react";
import React from "react";

const Header = ({ title }) => {
  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg p-4 border border-gray-700 rounded-full max-w-3xl w-full">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-100 hover:text-blue-600 cursor-pointer">
          {title}
        </h1>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <input
            type="text"
            className="bg-gray-700 text-gray-100 p-2 pl-12 pr-4 rounded-full border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 text-sm sm:w-64 lg:w-80 transition-all duration-300 ease-in-out"
            placeholder="Search here..."
          />
          <Search
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer transition duration-300"
            size={20}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
