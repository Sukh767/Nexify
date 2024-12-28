import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  BarChartOutlined,
  ShoppingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useLogoutMutation } from "../../features/user/userApiSlice";
import { clearCredentials } from "../../features/auth/authSlice";
import { persistor } from "../../app/store";

const { Sider } = Layout;

const SIDEBAR_ITEMS = [
  {
    key: "dashboard",
    icon: <BarChartOutlined style={{ color: "#6366f1" }} />,
    label: "Dashboard",
    children: [{ key: "overview", label: "Overview", path: "/" }],
  },
  {
    key: "products",
    icon: <ShoppingOutlined style={{ color: "#8B5CF6" }} />,
    label: "Products",
    children: [
      { key: "all-products", label: "All Products", path: "/products" },
      { key: "add-product", label: "Add Product", path: "/products/add" },
      { key: "categories", label: "Categories", path: "/products/categories" },
      { key: "brands", label: "Brands", path: "/products/brands" },
    ],
  },
  {
    key: "users",
    icon: <UserOutlined style={{ color: "#EC4899" }} />,
    label: "Users",
    children: [
      { key: "all-users", label: "All Users", path: "/users" },
      { key: "add-user", label: "Add User", path: "/users/add" },
      { key: "roles", label: "Roles", path: "/users/roles" },
      { key: "profile", label: "Profile", path: "/users/account" },
    ],
  },
  {
    key: "orders",
    icon: <ShoppingCartOutlined style={{ color: "#F59E0B" }} />,
    label: "Orders",
    children: [
      { key: "all-orders", label: "All Orders", path: "/orders" },
      { key: "pending-orders", label: "Pending Orders", path: "/orders/pending" },
      { key: "completed-orders", label: "Completed Orders", path: "/orders/completed" },
    ],
  },
  {
    key: "authentication",
    icon: <SafetyCertificateOutlined style={{ color: "#EF4444" }} />,
    label: "Authentication",
    children: [
      { key: "login", label: "Login", path: "/auth/login" },
      { key: "forgot-password", label: "Forgot Password", path: "/auth/forgot-password" },
      { key: "reset-password", label: "Reset Password", path: "/auth/reset-password" },
    ],
  },
  {
    key: "sales",
    icon: <DollarOutlined style={{ color: "#10B981" }} />,
    label: "Sales",
    children: [{ key: "sales-view", label: "Sales view", path: "/sales" }],
  },
  {
    key: "settings",
    icon: <SettingOutlined style={{ color: "#6EE7B8" }} />,
    label: "Settings",
    children: [{ key: "settings-view", label: "Settings", path: "/settings" }],
  },
];

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { userInfo, isAuthenticated } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    if (onToggle) onToggle(!collapsed);
  };

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      if (response.success) {
        dispatch(clearCredentials());
        await persistor.purge(); // Clear persisted state
        toast.success(response.message);
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out.");
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      width={256}
      collapsedWidth={80}
      className="min-h-screen bg-gray-800 bg-opacity-50 backdrop-blur-md border-r border-gray-700 transition-all duration-300 ease-in-out"
      theme="dark"
      breakpoint="lg"
      onBreakpoint={(broken) => {
        if (broken) {
          setCollapsed(true);
        }
      }}
    >
      <div className="p-4 flex justify-end">
        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: "text-white text-xl cursor-pointer",
          onClick: toggleCollapsed,
        })}
      </div>
      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        className="bg-transparent"
        items={SIDEBAR_ITEMS.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children.map((child) => ({
            key: child.key,
            label: <Link to={child.path}>{child.label}</Link>,
          })),
        }))}
      />
      {/* User Profile and Logout */}
      {isAuthenticated && (
        <div className="absolute bottom-10 w-full p-4 flex flex-col items-center mb-4">
          <img
            src="https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            alt="User Profile"
            className="w-10 h-10 rounded-full mb-2"
          />
          {!collapsed && (
            <div className="text-gray-300 text-sm font-semibold mb-2 truncate max-w-full">
              {userInfo?.first_name} {userInfo?.last_name}
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full bg-gray-700 hover:bg-red-600 text-white font-bold py-2 px-4 transition-colors duration-300 ease-in-out flex items-center justify-center ${
              collapsed ? "text-xl" : "text-base"
            }`}
          >
            <LogoutOutlined className={collapsed ? "mr-0" : "mr-2"} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      )}
    </Sider>
  );
};

export default Sidebar;