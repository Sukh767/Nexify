import React, { useState, useEffect } from "react";
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from "../../features/category/categoryApiSlice";
import { Eye, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import toast from "react-hot-toast";

const Category = () => {
  const { data: categories, isLoading, error, refetch:refetchCategories } = useGetAllCategoriesQuery();
  const [deleteCategory, {isLoading:deleteLoading}] = useDeleteCategoryMutation();
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    if (categories?.data) {
      setFilteredCategories(categories.data);
    }
  }, [categories]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = categories.data.filter((category) =>
      category.name.toLowerCase().includes(term)
    );
    setFilteredCategories(filtered);
    setCurrentPage(1);
  };

  const getCategoryType = (category) => {
    return category.parentCategory && category.parentCategory.length > 0
      ? "Sub Category"
      : "Parent Category";
  };

  const handleEdit = (id) => {
    console.log("Edit category:", id);
  };

  const handleView = (id) => {
    // Implement view functionality
    console.log("View category:", id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategory(id).unwrap();
      console.log(response);
  
      if (response.status === 'successful') {
        toast.success(response.message || "Category deleted successfully!");
        // Trigger a re-fetch of categories
        refetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category.");
    }
    console.log("Delete category:", id);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <div className="text-center py-4 text-white">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
    <div className="container mx-auto py-8 text-white">
      <h1 className="text-2xl font-bold">Category List</h1>
      <div className="overflow-x-auto ">
        <div className="p-4 border-b border-gray-700 ">
          <div className="relative w-64 ml-auto">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                SL NO.
              </th>
              <th className="px-5 py-3 border-b border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-5 py-3 border-b border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Category Type
              </th>
              <th className="px-5 py-3 border-b border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Created/Updated Date
              </th>
              <th className="px-5 py-3 border-b border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((category, index) => (
              <tr 
                key={category._id}
                className="hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  {category.name}
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  {getCategoryType(category)}
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  {new Date(category.updatedAt).toLocaleString()}
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      category.status === "Active"
                        ? "bg-green-300 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.status}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(category._id)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <Eye size={18} />
                    </button>
                    <Link to={`/categories/edit/${category._id}`}>
                    <button
                      onClick={() => handleEdit(category._id)}
                      className="text-yellow-400 hover:text-yellow-600"
                    >
                      <Edit size={18} />
                    </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-5 border-t border-gray-700 flex flex-col xs:flex-row items-center xs:justify-between">
          <span className="text-xs xs:text-sm text-gray-400">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredCategories.length)} of{" "}
            {filteredCategories.length} Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastItem >= filteredCategories.length}
              className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default Category;

