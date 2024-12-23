import { Search } from "lucide-react";
import React from "react";

const Header = ({ title }) => {
  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-4 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title and Search Bar */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-100">{title}</h1>
          <div className="relative">
            {/* Input with Icon */}
            <input
              type="text"
              className="bg-gray-700 text-gray-100 p-2 pl-10 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400 text-sm w-48 sm:w-64"
              placeholder="Search..."
            />
            {/* Icon */}
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
