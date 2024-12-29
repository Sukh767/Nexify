import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { useLoginMutation } from "../../features/user/userApiSlice";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [login, { loading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({
        email: user.email,
        password: user.password,
      }).unwrap();
      console.log("Login Response:", data);
      dispatch(
        setCredentials({
          userInfo: data.user,
          accessToken: data.user.accessToken,
        })
      );
      toast.success("Login successful");
      user.email = "";
      user.password = "";
      navigate("/");
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-900 via-teal-700 to-emerald-600">
        {/* <img
          src="https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Background"
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Logo in top corner */}
      {/* <div className="absolute top-4 left-4 z-20">
        <Link to="/">
        <img
          src="https://res.cloudinary.com/dbotqrsil/image/upload/v1735308868/fashion_store_4_gb43dg.png"
          alt="Nexify Logo"
          className="w-24 h-auto cursor-pointer"
        />
        </Link>
      </div> */}

      {/* Content Container */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl items-stretch justify-center z-10 shadow-2xl">
        {/* Login Form */}
        <div className="w-full md:w-1/2 p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm">
          <Link
            to="/"
            className="text-sm font-medium flex items-center space-x-2 text-white mb-8 hover:text-gray-200 transition-colors"
          >
            <div className="flex items-center hover:text-orange-400">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </div>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2 text-center">Log In</h1>
          <p className="text-gray-200 mb-8 text-center">
            Access your Nexify Admin Panel
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleInputChange}
                  placeholder="mail@example.com"
                  required
                  className="w-full px-3 py-2 pl-10 text-white bg-white bg-opacity-20 border-none rounded-none placeholder-gray-400 outline-none"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
              </div>
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={user.password}
                  onChange={handleInputChange}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full px-3 py-2 pl-10 text-white bg-white bg-opacity-20 border-none rounded-none placeholder-gray-400 outline-none"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-50" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="text-red hover:before:bg-redborder-red-500 relative h-[45px] w-full overflow-hidden border border-emerald-500 bg-white px-3 text-emerald-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-emerald-500 before:transition-all before:duration-500 hover:text-white hover:shadow-teal-700 hover:before:left-0 hover:before:w-full"
            >
              <span className="relative z-10">Let's Go</span>
            </button>
          </form>
        </div>

        {/* White div with company logo and text */}
        <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center items-center">
          <img
            src="https://res.cloudinary.com/dbotqrsil/image/upload/v1735309936/output-onlinepngtools_wfosdm.png"
            alt="Nexify Logo"
            className="w-48 mb-8"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome to Nexify</h2>
          <p className="text-gray-600 text-center mb-8">
            Empower your e-commerce journey with our cutting-edge admin panel. <br/>Manage your store with ease and precision.
          </p>
          <div className="text-sm text-gray-500 text-center">
            <p>© 2024 Nexify. All rights reserved.</p>
            <p>Transforming e-commerce management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

