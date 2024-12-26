import { useState } from "react";
import { Link } from "react-router-dom";
import { Apple, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
  };

  return (
    <div className="flex h-screen">
      {/* Left Section: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-6 py-8 lg:py-12 bg-gray-900">
        {/* Back Button */}
        <div className="w-full">
          <Link
            to="/"
            className="text-sm font-medium flex items-center space-x-2 text-gray-300 hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to dashboard</span>
          </Link>
        </div>

        {/* Form Content */}
        <div className="w-full max-w-lg mx-auto flex-grow flex flex-col justify-center">
          <h1 className="text-3xl font-semibold text-white text-center mb-2">
            Sign Up
          </h1>
          <p className="mb-8 text-sm text-gray-400 text-center">
            Join us and start your journey today!
          </p>

          {/* Google Sign Up Button */}
          <button className="flex items-center justify-center w-full py-2 px-4 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors mb-6">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={user.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
                className="w-full px-3 py-2 text-white text-sm bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="sr-only">
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
                className="w-full px-3 py-2 text-white text-sm bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
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
                className="w-full px-3 py-2 text-white text-sm bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
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
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-400 font-medium hover:underline"
            >
              Let's Sign in
            </Link>
          </p>
        </div>

        {/* Footer
        <p className="text-sm text-gray-400 text-center mt-8">
          © 2024 Nexify. Made with ❤️ by{" "}
          <a
            href="https://themewagon.com/"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 font-medium hover:underline"
          >
            ThemeWagon
          </a>
        </p> */}
      </div>

      {/* Right Section: Image */}
      <div className="hidden lg:block w-1/2 right-0 top-0 h-screen overflow-hidden relative">
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-gray-900 opacity-90"></div>

  {/* First Image */}
  <div className="absolute inset-0 flex items-center justify-center z-10 ">
    <img
      src="https://res.cloudinary.com/dbotqrsil/image/upload/v1735181821/Screenshot_from_2024-12-26_07-56-06-removebg-preview_bicue6.png"
      alt="Centered Image"
      className="max-w-full max-h-full"
    />
  </div>

  {/* Second Image */}
  <img
    src="https://res.cloudinary.com/dbotqrsil/image/upload/v1735177240/auth-bg_ndwkcr.png"
    alt="Background"
    className="w-full h-full object-cover z-0"
    style={{
      clipPath: "polygon(0 0, 100% 0%, 100% 100%, 29% 74%)",
    }}
  />
</div>

    </div>
  );
};

export default SignUp;