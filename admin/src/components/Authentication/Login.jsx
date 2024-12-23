import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user); // Handle login logic here
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/18069211/pexels-photo-18069211/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-represents-how-ai-powered-tools-can-support-us-and-save-time-it-was-created-by-martina-stiftinger-as-part-of-the-visua.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md z-10 p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl">
        {/* Back Button */}
        <Link
          to="/"
          className="text-sm font-medium flex items-center space-x-2 text-white mb-8 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to dashboard</span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Log In</h1>
        <p className="text-gray-200 mb-8">
          Welcome to Nexify
          <br />
          Please log in to continue
        </p>

        {/* Login Form */}
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
              value={user.email}
              onChange={handleInputChange}
              placeholder="mail@example.com"
              required
              className="w-full px-3 py-2 text-white bg-white bg-opacity-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={handleInputChange}
              placeholder="Min. 8 characters"
              required
              className="w-full px-3 py-2 text-white bg-white bg-opacity-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-300 text-center">
          Don't have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-indigo-400 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Footer */}
        {/* <p className="mt-8 text-sm text-gray-300 text-center">
          © 2024 Nexify. Made with ❤️ by{" "}
          <a
            href="https://nexify.com/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 font-medium hover:underline"
          >
            nexify
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Login;

