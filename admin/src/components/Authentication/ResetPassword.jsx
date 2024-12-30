import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from "react-hot-toast";
import { useSetNewPasswordMutation } from "../../features/user/userApiSlice";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState({ oldPassword: false, password: false, confirmPassword: false });

  const [setNewPassword, isLoading, error] = useSetNewPasswordMutation();

  const handleInputChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate input
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("All fields are required.");
      return;
    }
  
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
  
    try {
      const response = await setNewPassword({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      }).unwrap();
  
      console.log(response);
      toast.success(response.message || "Password reset successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.data?.message || "Failed to reset password.");
    }
  };
  

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-700">
      {/* Background Image */}
      {/* <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/29833480/pexels-photo-29833480/free-photo-of-vivid-green-and-blue-abstract-glass-formation.jpeg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div> */}

      {/* Reset Password Form */}
      <div className="w-full max-w-md z-10 p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-md shadow-xl">
        {/* Back Button */}
        <Link
          to="/login"
          className="text-sm font-medium flex items-center space-x-2 text-white mb-8 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-gray-200 mb-8">
          Enter your new password below to reset your account.
        </p>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Old Password Field */}
          <div className="relative">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-200 mb-1">
              Old Password
            </label>
            <input
              id="oldPassword"
              name="oldPassword"
              type={showPassword.oldPassword ? "text" : "password"}
              value={passwords.oldPassword}
              onChange={handleInputChange}
              placeholder="Enter old password"
              required
              className="w-full px-3 py-2 text-white bg-white bg-opacity-20 border border-gray-300 rounded-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('oldPassword')}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-200"
            >
              {showPassword.oldPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* New Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type={showPassword.password ? "text" : "password"}
              value={passwords.newPassword}
              onChange={handleInputChange}
              placeholder="Enter new password"
              required
              className="w-full px-3 py-2 text-white bg-white bg-opacity-20 border border-gray-300 rounded-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-200"
            >
              {showPassword.password ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword.confirmPassword ? "text" : "password"}
              value={passwords.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              required
              className="w-full px-3 py-2 text-white bg-white bg-opacity-20 border border-gray-300 rounded-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirmPassword')}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-200"
            >
              {showPassword.confirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Reset Password
          </button>
        </form>

        {/* <p className="mt-6 text-sm text-gray-300 text-center">
          Remember your password?{" "}
          <Link
            to="/auth/login"
            className="text-indigo-400 font-medium hover:underline"
          >
            Log In
          </Link>
        </p> */}

        {/* Footer */}
        {/* <p className="mt-8 text-sm text-gray-300 text-center">
          © 2024 Nexify. Made with ❤️ by{" "}
          <a
            href="https://Nexify.com/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 font-medium hover:underline"
          >
            Nexify
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default ResetPassword;

