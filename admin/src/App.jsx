import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import ProductPage from "./pages/ProductPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Login from "./components/Authentication/Login";
import ResetPassword from "./components/Authentication/ResetPassword";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import PrivateRoute from "./components/private/PrivateRoute";
import SettingsPage from "./pages/Settingspage";
import Profile from "./components/users/Profile";
import AddProduct from "./components/products/AddProduct";
import Header from "./components/common/Header";
import UpdateProduct from "./components/products/UpdateProduct";
import LandingPage from "./pages/LandingPage";
import { useSelector } from "react-redux";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Callback to handle sidebar collapse
  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      {isAuthenticated && (
        <div className="fixed top-0 left-0 w-full z-20 bg-gray-800">
          <Header title={"Dashboard"} />
        </div>
      )}

      <div className={`flex ${isAuthenticated ? "pt-16" : "h-screen"}`}>
        {/* Sidebar */}
        {isAuthenticated && (
          <div
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-800 ${
              isSidebarCollapsed ? "w-20" : "w-64"
            } transition-all duration-300`}
          >
            <Sidebar onToggle={handleSidebarToggle} />
          </div>
        )}

        {/* Main Content */}
        <div
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isAuthenticated
              ? isSidebarCollapsed
                ? "ml-20"
                : "ml-64"
              : ""
          }`}
          style={{
            height: isAuthenticated ? "calc(100vh - 4rem)" : "100vh", // Adjust for header height
          }}
        >
          <Routes>
            {/* Public Routes */}
            {!isAuthenticated && (
              <>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}

            {/* Private Routes */}
            {isAuthenticated && (
              <>
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/" element={<PrivateRoute element={DashboardPage} />} />
                <Route path="/products" element={<PrivateRoute element={ProductPage} />} />
                <Route path="/products/add" element={<PrivateRoute element={AddProduct} />} />
                <Route path="/products/:id" element={<PrivateRoute element={UpdateProduct} />} />
                <Route path="/users" element={<PrivateRoute element={UsersPage} />} />
                <Route path="/users/account" element={<PrivateRoute element={Profile} />} />
                <Route path="/sales" element={<PrivateRoute element={SalesPage} />} />
                <Route path="/orders" element={<PrivateRoute element={OrdersPage} />} />
                <Route path="/analytics" element={<PrivateRoute element={AnalyticsPage} />} />
                <Route path="/settings" element={<PrivateRoute element={SettingsPage} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
