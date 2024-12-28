import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2 } from "lucide-react";
import { useDeleteUserMutation, useGetAllUserListQuery } from "../../features/user/userApiSlice";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UsersTable = () => {
  const navigate = useNavigate();
  const { data: userData, isLoading, error } = useGetAllUserListQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (userData?.status === 'successful' && Array.isArray(userData?.data)) {
      setFilteredUsers(userData.data);
    }
  }, [userData]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (userData?.status && Array.isArray(userData.data)) {
      const filtered = userData.data.filter(
        (user) =>
          user.first_name.toLowerCase().includes(term) ||
          user.last_name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
      setFilteredUsers(filtered);
    }
  };

  const editHandler = (id) => {
    navigate(`/users/edit/${id}`);
  };

  const deleteHandler = async(id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await deleteUser(id);
        if (response.status) {
          toast.success(response.message || "User deleted successfully");
        }
      } catch (error) {
        console.error("Delete user error:", error);
        
      }
    }
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Users</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.first_name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">
                        {user.first_name} {user.last_name}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.email}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.mobile}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "Active"
                        ? "bg-green-800 text-green-100"
                        : "bg-red-800 text-red-100"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => editHandler(user._id)}
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTable;
