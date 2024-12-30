import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  BarChartOutlined,
  ShoppingOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useLogoutMutation } from "../../features/user/userApiSlice";
import { clearCredentials } from "../../features/auth/authSlice";
import { persistor } from "../../app/store";
import { Dock, GlobeIcon, Layers, ListTreeIcon, Package } from "lucide-react";

const { Sider } = Layout;

const iconStyle = { color: "#6366f1", fontSize: "1.5rem" }; // Adjust fontSize as needed


const SIDEBAR_ITEMS = [
  {
    key: "dashboard",
    icon: <BarChartOutlined style={{ ...iconStyle, color: "#F26B0F" }} />,
    label: "Dashboard",
    children: [{ key: "overview", label: "Overview", path: "/" }],
  },
  {
    key: "products",
    icon: <ShoppingOutlined style={{ ...iconStyle, color: "#8B5CF6" }} />,
    label: "Products",
    children: [
      { key: "all-products", label: "All Products", path: "/products" },
      { key: "add-product", label: "Add Product", path: "/products/add" },
    ],
  },
  {
    key: "categories",
    icon: <Layers style={{ ...iconStyle, color: "#638C6D" }} />,
    label: "Categories",
    children: [
      { key: "all-categories", label: "All Categories", path: "/categories" },
      { key: "add-category", label: "Add Category", path: "/categories/add" },
    ],
  },
  {
    key: "Variants",
    icon: <ListTreeIcon style={{ ...iconStyle, color: "#E2BBE9" }} />,
    label: "Variants",
    children: [
      { key: "all-Variants", label: "Variants", path: "/Variants" },
    ]
  },
  {
    key: "users",
    icon: <UserOutlined style={{ ...iconStyle, color: "#EC4899" }} />,
    label: "Users",
    children: [
      { key: "all-users", label: "All Users", path: "/users" },
    ],
  },
  {
    key: "orders",
    icon: <Package style={{ ...iconStyle, color: "#F59E0B" }} />,
    label: "Orders",
    children: [
      { key: "all-orders", label: "All Orders", path: "/orders" },
      {
        key: "pending-orders",
        label: "Pending Orders",
        path: "/orders/pending",
      },
      {
        key: "completed-orders",
        label: "Completed Orders",
        path: "/orders/completed",
      },
    ],
  },
  {
    key: "authentication",
    icon: <SafetyCertificateOutlined style={{ ...iconStyle, color: "#EF4444" }} />,
    label: "Authentication",
    children: [
      {
        key: "forgot-password",
        label: "Forgot Password",
        path: "/auth/forgot-password",
      },
      {
        key: "reset-password",
        label: "Reset Password",
        path: "/auth/reset-password",
      },
    ],
  },
  {
    key: "sales",
    icon: <DollarOutlined style={{ ...iconStyle, color: "#E88D67" }} />,
    label: "Sales",
    children: [{ key: "sales-view", label: "Sales view", path: "/sales" }],
  },
  {
    key: "settings",
    icon: <SettingOutlined style={{ ...iconStyle, color: "#F6FFA6" }} />,
    label: "Settings",
    children: [{ key: "settings-view", label: "Settings", path: "/settings" }],
  },
  {
    key: "Webinfo",
    icon: <GlobeIcon style={{ ...iconStyle, color: "#7EA1FF" }} />,
    label: "Webinfo",
    children: [
      { key: "Webinfo-view", label: "Webinfo", path: "/webinfo" },
      { key: "Webinfo-contact", label: "Contact us", path: "/webinfo/contact" },
    ],
  },
  {
    key: "brand",
    icon: <CodeSandboxOutlined style={{ ...iconStyle, color: "#FA7070" }} />,
    label: "Brand",
    children: [
      { key: "brands-view", label: "Brands", path: "/brand" }
    ],
  },
  {
    key: "banner",
    icon: <Dock style={{ ...iconStyle, color: "#0D7C66" }} />,
    label: "Banner",
    children: [
      { key: "banners-view", label: "All Banner", path: "/banner" },
    ],
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
      className="min-h-screen bg-gray-00 bg-opacity-50 backdrop-blur-md border-r border-gray-700 transition-all duration-300 ease-in-out"
      theme="dark"
      breakpoint="lg"
      onBreakpoint={(broken) => {
        if (broken) {
          setCollapsed(true);
        }
      }}
    >
      <div className="p-4 flex justify-end">
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "text-white text-xl cursor-pointer",
            onClick: toggleCollapsed,
          }
        )}
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
        <div className="absolute bottom-5 w-full p-4 flex flex-col items-center mb-4">
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
