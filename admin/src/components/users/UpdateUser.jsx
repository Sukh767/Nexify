import React, { useEffect, useState } from "react";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../features/user/userApiSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  UserCheck,
  Shield,
  ToggleLeft,
  CalendarRange,
} from "lucide-react";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useGetUserDetailsQuery(id);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    role: "",
    status: "",
    isVerified: true,
    DOB: "",
  });

  useEffect(() => {
    if (user?.status === "successful" && user?.data) {
      setUserData({
        first_name: user.data.first_name || "",
        last_name: user.data.last_name || "",
        mobile: user.data.mobile || "",
        email: user.data.email || "",
        role: user.data.isAdmin ? "admin" : "user",
        status: user.data.status || "",
        isVerified: user.data.isVerified,
        DOB: user.data.DOB || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUser({ id, ...userData }).unwrap();
      if (result.success) {
        toast.success("User updated successfully");
        navigate("/");
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      toast.error(
        err.data?.message || "An error occurred while updating the user"
      );
    }
  };

  if (isLoading)
    return <div className="text-center text-white text-2xl">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 text-2xl">
        Error: {error.message}
      </div>
    );

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      
      <form
        className="w-full max-w-3xl p-10"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-gray-50 mb-8 font-mono">UPDATE USER DETAILS</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="first_name"
            >
              First Name
            </label>
            <div className="flex items-center">
              <User className="absolute left-3 text-teal-500" size={18} />
              <input
                className="shadow bg-gray-600 appearance-none border w-full py-2 px-3 pl-10 text-gray-50 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="first_name"
                type="text"
                name="first_name"
                value={userData.first_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="relative">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="last_name"
            >
              Last Name
            </label>
            <div className="flex items-center">
              <User className="absolute left-3 text-teal-500" size={18} />
              <input
                className="shadow bg-gray-600 appearance-none border  w-full py-2 px-3 pl-10 text-gray-50 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="last_name"
                type="text"
                name="last_name"
                value={userData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="relative">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="mobile"
            >
              Mobile
            </label>
            <div className="flex items-center">
              <Phone className="absolute left-3 text-teal-500" size={18} />
              <input
                className="shadow bg-gray-600 appearance-none border  w-full py-2 px-3 pl-10 text-gray-50 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="mobile"
                type="tel"
                name="mobile"
                value={userData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="relative">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="flex items-center">
              <Mail className="absolute left-3 text-teal-500" size={18} />
              <input
                className="shadow cursor-not-allowed appearance-none border w-full py-2 px-3 pl-10 text-gray-950 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
                id="email"
                type="email"
                name="email"
                value={userData.email}
                readOnly
              />
            </div>
          </div>
          <div className="relative">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <div className="flex items-center">
              <Shield className="absolute left-3 text-teal-500" size={18} />
              <select
                className="shadow bg-gray-600 appearance-none border  w-full py-2 px-3 pl-10 text-gray-50 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="status"
            >
              Status
            </label>
            <div className="flex items-center">
              <ToggleLeft className="absolute left-3 text-teal-500" size={18} />
              <select
                className="shadow bg-gray-600 appearance-none border  w-full py-2 px-3 pl-10 text-gray-50 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="status"
                name="status"
                value={userData.status}
                onChange={handleChange}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <label
              className="block text-gray-300 text-sm font-semibold mb-2"
              htmlFor="DOB"
            >
              Date of Birth
            </label>
            <div className="flex items-center">
              <CalendarRange
                className="absolute left-3 text-teal-500"
                size={18}
              />
              <input
                className="shadow bg-gray-600 appearance-none border w-full py-2 px-3 pl-10 text-gray-50 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="DOB"
                type="date"
                name="DOB"
                value={userData.DOB}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <label className="flex items-center space-x-3 mb-3 cursor-not-allowed">
            <input
              type="checkbox"
              name="isVerified"
              checked={userData.isVerified}
              className="form-checkbox h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
              disabled
            />
            <span className="text-gray-300 font-semibold flex items-center">
              <UserCheck size={18} className="mr-2" />
              Is Verified
            </span>
          </label>
        </div>
        <div className="flex items-center justify-end mt-8">
          <button
            className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-emerald-500  group"
            type="submit"
            disabled={isUpdating}
          >
            <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-emerald-700  group-hover:-mr-4 group-hover:-mt-4">
              <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
            </span>
            <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-emerald-700  group-hover:-ml-4 group-hover:-mb-4">
              <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
            </span>
            <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-emerald-600 group-hover:translate-x-0" />
            <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
              {isUpdating ? "Updating..." : "Update User"}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default UpdateUser;
