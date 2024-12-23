import React, { useState } from "react";
import {
  BarChart2,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  Key,
  LockKeyholeOpen,
  UserPlus,
  RectangleEllipsis,
  FileLock,
  IndianRupee,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: BarChart2,
    color: "#6366f1",
    href: "/",
    children: [{ name: "Overview", href: "/" }],
  },
  {
    name: "Products",
    icon: ShoppingBag,
    color: "#8B5CF6",
    href: "/products",
    children: [
      { name: "All Products", href: "/products" },
      { name: "Add Product", href: "/products/add" },
      { name: "Categories", href: "/products/categories" },
      { name: "Brands", href: "/products/brands" },
    ],
  },
  {
    name: "Users",
    icon: Users,
    color: "#EC4899",
    href: "/users",
    children: [
      { name: "All Users", href: "/users" },
      { name: "Add User", href: "/users/add" },
      { name: "Roles", href: "/users/roles" },
    ],
  },
  {
    name: "Orders",
    icon: ShoppingCart,
    color: "#F59E0B",
    href: "/orders",
    children: [
      { name: "All Orders", href: "/orders" },
      { name: "Pending Orders", href: "/orders/pending" },
      { name: "Completed Orders", href: "/orders/completed" },
    ],
  },
  {
    name: "Authentication",
    icon: ShieldAlert,
    color: "#EF4444",
    href: "/auth",
    children: [
      { name: "Login", href: "/auth/login", icon: LockKeyholeOpen },
      { name: "Signup", href: "/auth/signup", icon: UserPlus },
      {
        name: "Forgot Password",
        href: "/auth/forgot-password",
        icon: RectangleEllipsis,
      },
      { name: "Reset Password", href: "/auth/reset-password", icon: FileLock },
    ],
  },
  {
    name: "Sales",
    icon: IndianRupee,
    color: "#10B981",
    href: "/",
    children: [{ name: "Sales view", href: "/sales" }],
  },
  {
    name: "Settings",
    icon: Settings,
    color: "#6EE7B8",
    href: "/settings",
    children: [{ name: "Settings", href: "/settings" }],
  },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        {/* Sidebar Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        {/* Navigation Items */}
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item, index) => (
            <div key={item.href}>
              <motion.div
                className="flex items-center justify-between p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2 cursor-pointer"
                onClick={() => toggleDropdown(index)}
              >
                <div className="flex items-center">
                  <item.icon
                    size={20}
                    style={{ color: item.color, minWidth: "20px" }}
                  />
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
                </div>
                {item.children && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      activeDropdown === index ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </motion.div>

              {/* Dropdown for Children */}
              {item.children && activeDropdown === index && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-6 border-l-2 border-gray-600"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block p-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700 transition-colors hover:text-orange-500"
                      >
                        {child.icon && (
                          <child.icon size={16} className="mr-2" />
                        )}
                        {child.name}
                      </Link>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
