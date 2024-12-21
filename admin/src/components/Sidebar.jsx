import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  BarChart2,
  DollarSign,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  Key,
  ChevronDown,
  UserPlus,
  LockKeyholeOpen,
  RectangleEllipsis,
  FileLock,
  IndianRupee,
} from "lucide-react";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", icon: BarChart2, color: "#6366f1", href: "/" },
  { name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/products" },
  { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
  { name: "Sales", icon: IndianRupee, color: "#10B981", href: "/sales" },
  { name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
  { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
  { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const AUTH_ITEMS = [
  { name: "Login", icon: LockKeyholeOpen ,href: "/auth/login" },
  { name: "Signup",icon:UserPlus  , href: "/auth/signup" },
  { name: "Forgot Password",icon: RectangleEllipsis, href: "/auth/forgot-password" },
  { name: "Reset Password",icon: FileLock, href: "/auth/reset-password" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);

  return (
    <motion.div
      className="relative z-10 transition-all duration-300 ease-in-out flex-shrink-0"
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        {/* Sidebar Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
          aria-label="Toggle Sidebar"
        >
          <Menu size={24} />
        </motion.button>

        {/* Navigation Items */}
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  "flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2",
                  isActive ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-gray-300"
                )
              }
            >
              {/* Icon */}
              <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />

              {/* Item Name with Animation */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-4 whitespace-nowrap"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}

          {/* Authentication Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
              className={clsx(
                "flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 w-full",
                isAuthDropdownOpen ? "bg-gray-700 text-white" : "hover:bg-gray-700 text-gray-300"
              )}
            >
              <Key size={20} style={{ color: "#EF4444", minWidth: "20px" }} />
              {isSidebarOpen && (
                <>
                  <span className="ml-4 whitespace-nowrap">Authentication</span>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isAuthDropdownOpen ? 180 : 0 }}
                    className="ml-auto"
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </>
              )}
            </button>
            <AnimatePresence>
              {isAuthDropdownOpen && isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                  className="pl-10"
                >
                  {AUTH_ITEMS.map((authItem) => (
                    <NavLink
                      key={authItem.href}
                      to={authItem.href}
                      className="block p-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      {authItem.icon && <authItem.icon size={16} className="mr-2" />}
                      {authItem.name}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
