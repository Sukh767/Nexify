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
import UpdateUser from "./components/users/UpdateUser";
import ViewOrder from "./components/orders/ViewOrder";
import AddCategory from "./components/category/AddCategory";
import CategoryPage from './pages/CategoryPage';
import EditCategory from "./components/category/EditCategory";
import VariantsPage from "./pages/VariantsPage";
import CreateVariant from "./components/variants/CreateVariant";
import EditVariant from "./components/variants/EditVariant";
import BannerPage from './pages/BannerPage';
import CreateBanner from './components/banner/CreateBanner';
import UpdateBanner from './components/banner/UpdateBanner';
import UpdateBrand from './components/brand/UpdateBrand';
import BrandPage from './pages/BrandPage';
import CreateBrand from './components/brand/CreateBrand';

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
        <div className="fixed top-0 left-0 w-full z-20 bg-gray-800 ">
          {/* <Header isSidebarCollapsed={isSidebarCollapsed} /> */}
        </div>
      )}

      <div className={`flex ${isAuthenticated ? "pt-10" : "h-screen"}`}>
        {/* Sidebar */}
        {isAuthenticated && (
          <div
            className={`fixed top-0 left-0 h-[calc(100vh-4rem)] bg-gray-800 ${
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
                <Route path="/categories" element={<PrivateRoute element={CategoryPage} />} />
                <Route path="/categories/add" element={<PrivateRoute element={AddCategory} />} />
                <Route path="/categories/edit/:id" element={<PrivateRoute element={EditCategory} />} />
                <Route path="/variants" element={<PrivateRoute element={VariantsPage} />} />
                <Route path="/variants/add/:id" element={<PrivateRoute element={CreateVariant} />} />
                <Route path="/variants/:id" element={<PrivateRoute element={EditVariant} />} />
                <Route path="/users" element={<PrivateRoute element={UsersPage} />} />
                <Route path="/users/edit/:id" element={<PrivateRoute element={UpdateUser} />} />
                <Route path="/sales" element={<PrivateRoute element={SalesPage} />} />
                <Route path="/orders" element={<PrivateRoute element={OrdersPage} />} />
                <Route path="/orders/view-order/:id" element={<PrivateRoute element={ViewOrder} />} />
                <Route path="/analytics" element={<PrivateRoute element={AnalyticsPage} />} />
                <Route path="/settings" element={<PrivateRoute element={SettingsPage} />} />
                <Route path="/settings/users/account" element={<PrivateRoute element={Profile} />} />
                <Route path="/banner" element={<PrivateRoute element={BannerPage} />} />
                <Route path="/banner/create-banner" element={<PrivateRoute element={CreateBanner} />} />
                <Route path="/banner/:id" element={<PrivateRoute element={UpdateBanner} />} />
                <Route path="/brand" element={<PrivateRoute element={BrandPage} />} />
                <Route path="/brand/create-brand" element={<PrivateRoute element={CreateBrand} />} />
                <Route path="/brand/:id" element={<PrivateRoute element={UpdateBrand} />} />
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
