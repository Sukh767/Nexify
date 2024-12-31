import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2, Check, X } from "lucide-react";
import {
  useDeleteUserMutation,
  useGetAllUserListQuery,
  useUpdateUserRoleMutation,
  useUpdateUserStatusMutation,
} from "../../features/user/userApiSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UsersTable = () => {
  const navigate = useNavigate();
  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useGetAllUserListQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newRole, setNewRole] = useState("");

  const statuses = ["Active", "Inactive"];
  const roles = ["User", "Admin", "Supreme"];

  useEffect(() => {
    if (userData?.status === "successful" && Array.isArray(userData?.data)) {
      setFilteredUsers(userData.data);
    }
  }, [userData]);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await updateUserStatus({ id, status }).unwrap();
      if (response.success) {
        toast.success(response.message || "User status updated successfully");
        setEditingUser(null);
        refetch();
      }
    } catch (error) {
      console.error("Update user status error:", error);
      toast.error(error.message || "Failed to update user status");
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      console.log("role", role);
      const isAdmin = role === "Admin" ? true : false;
      console.log("isAdmin", isAdmin);
      const response = await updateUserRole({ id, isAdmin }).unwrap();
      if (response.success) {
        toast.success(response.message || "User role updated successfully");
        setEditingUser(null);
        refetch();
      }
    } catch (error) {
      console.error("Update user role error:", error);
      toast.error("Failed to update user role");
    }
  };

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

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await deleteUser(id).unwrap();
        if (response.status) {
          toast.success(response.message || "User deleted successfully");
          refetch();
        }
      } catch (error) {
        console.error("Delete user error:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewStatus(user.status);
    setNewRole(user.isAdmin ? "Admin" : "User");
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setNewStatus("");
    setNewRole("");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-6 border border-gray-700"
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
            className="bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="relative flex-shrink-0 h-10 w-10 group">
                      <div
                        className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer"
                        onClick={() => editHandler(user._id)}
                      >
                        {user.first_name.charAt(0)}
                      </div>
                      <div
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-[#3E5879] text-white text-xs font-medium py-2 px-4 shadow-lg"
                        role="tooltip" 
                      >
                        Click to edit
                      </div>
                    </div>

                    <div className="ml-4">
                      <div
                        className="text-sm font-medium text-gray-100 cursor-pointer hover:text-[#00FF9C]"
                        onClick={() => editHandler(user._id)}
                      >
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
                  {editingUser && editingUser._id === user._id ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="bg-gray-700 text-white rounded px-2 py-1"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                      {user.isAdmin ? "Admin " : "User"}
                    </span>&nbsp;
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-600 text-gray-50">
                      {user.isSupreme ? "Supreme" : ""}
                    </span>
                    </>
                    
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser && editingUser._id === user._id ? (
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="bg-gray-700 text-white rounded px-2 py-1"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === "Active"
                          ? "bg-green-800 text-green-100"
                          : "bg-red-800 text-red-100"
                      }`}
                    >
                      {user.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {editingUser && editingUser._id === user._id ? (
                    <>
                      <button
                        className="text-green-400 hover:text-green-300 mr-2"
                        onClick={() => {
                          handleRoleChange(user._id, newRole);
                          handleStatusChange(user._id, newStatus);
                        }}
                        disabled={isUpdatingRole || isUpdatingStatus}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={handleCancelEdit}
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
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
