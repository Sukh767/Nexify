import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import ProductPage from "./pages/ProductPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Login from "./components/Authentication/Login";
import SignUp from "./components/Authentication/SignUp";
import ResetPassword from "./components/Authentication/ResetPassword";
import ForgotPassword from "./components/Authentication/ForgotPassword";
import PrivateRoute from './components/private/PrivateRoute';
import SettingsPage from './pages/Settingspage';
import Profile from './components/users/Profile';
import AddProduct from "./components/products/AddProduct";
import Header from "./components/common/Header";

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Callback to handle sidebar collapse
  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-20 bg-gray-800">
        <Header title={"Dashboard"} />
      </div>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className={`fixed top-16 left-0 z-10 bg-gray-800`}>
          <Sidebar onToggle={handleSidebarToggle} />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />

            {/* Private Routes */}
            <Route path="/" element={<PrivateRoute element={DashboardPage} />} />
            <Route path="/products" element={<PrivateRoute element={ProductPage} />} />
            <Route path="/products/add" element={<PrivateRoute element={AddProduct} />} />
            <Route path="/users" element={<PrivateRoute element={UsersPage} />} />
            <Route path="/users/account" element={<PrivateRoute element={Profile} />} />
            <Route path="/sales" element={<PrivateRoute element={SalesPage} />} />
            <Route path="/orders" element={<PrivateRoute element={OrdersPage} />} />
            <Route path="/analytics" element={<PrivateRoute element={AnalyticsPage} />} />
            <Route path="/settings" element={<PrivateRoute element={SettingsPage} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
