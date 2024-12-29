import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email); // Handle forgot password logic here
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/29833480/pexels-photo-29833480/free-photo-of-vivid-green-and-blue-abstract-glass-formation.jpeg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Forgot Password Form */}
      <div className="w-full max-w-md z-10 p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-xl">
        {/* Back Button */}
        <Link
          to="/auth/login"
          className="text-sm font-medium flex items-center space-x-2 text-white mb-8 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Login</span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
        <p className="text-gray-200 mb-8">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@example.com"
              required
              className="w-full px-3 py-2 text-white bg-white bg-opacity-20 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-300 text-center">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-indigo-400 font-medium hover:underline"
          >
            Log In
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-300 text-center">
          © 2024 Nexify. Made with ❤️ by{" "}
          <a
            href="https://Nexify.com/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 font-medium hover:underline"
          >
            Nexify
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
