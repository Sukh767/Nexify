import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCreateCategoryMutation } from '../../features/category/categoryApiSlice';
import toast from 'react-hot-toast';

const AddCategory = () => {
  const navigate = useNavigate();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [formData, setFormData] = useState({
    category_name: '',
    category_url: '',
    editor: '',
    meta_description: '',
    meta_title: '',
    meta_keywords: '',
    parentCategory: '',
    status: 'Active',
    banner: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      banner: e.target.files[0]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category_name) newErrors.category_name = 'Category name is required';
    if (!formData.category_url) newErrors.category_url = 'Category URL is required';
    if (!formData.banner) newErrors.banner = 'Banner image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "banner") {
        form.append(key, formData[key], formData[key].name);
      } else {
        form.append(key, formData[key]);
      }
    });
  
    try {
      const response = await createCategory(form).unwrap();
  
      // Check if the category creation was successful
      if (response.status === "successful") {
        toast.success("Category created successfully!");
        console.log("Category created:", response);
        navigate("/categories");
      } else {
        toast.error("Category creation failed!");
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      console.error("Failed to create the category:", err);
  
      // Show a toast for the error and update the error state
      toast.error(err.data?.message || "Failed to create the category.");
      setErrors(err.data?.error || { general: "Failed to create category" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-transparent text-white p-8"
    >
      <div className="max-w-4xl mx-auto overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 font-mono">CREATE NEW CATEGORY</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <label className="block text-sm font-medium mb-2" htmlFor="category_name">
                  Category Name
                </label>
                <input
                  type="text"
                  id="category_name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
                {errors.category_name && <p className="text-red-500 text-xs mt-1">{errors.category_name}</p>}
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <label className="block text-sm font-medium mb-2" htmlFor="category_url">
                  Category URL
                </label>
                <input
                  type="text"
                  id="category_url"
                  name="category_url"
                  value={formData.category_url}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category URL"
                />
                {errors.category_url && <p className="text-red-500 text-xs mt-1">{errors.category_url}</p>}
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <label className="block text-sm font-medium mb-2" htmlFor="editor">Description</label>
              <textarea
                id="editor"
                name="editor"
                value={formData.editor}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category description"
                rows="6"
              ></textarea>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <label className="block text-sm font-medium mb-2" htmlFor="meta_title">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meta title"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <label className="block text-sm font-medium mb-2" htmlFor="meta_description">
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meta description"
                  rows="3"
                ></textarea>
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <label className="block text-sm font-medium mb-2" htmlFor="meta_keywords">
                Meta Keywords
              </label>
              <input
                type="text"
                id="meta_keywords"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meta keywords (comma-separated)"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <label className="block text-sm font-medium mb-2" htmlFor="parentCategory">
                Parent Category
              </label>
              <input
                type="text"
                id="parentCategory"
                name="parentCategory"
                value={formData.parentCategory}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter parent category (optional)"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <label className="block text-sm font-medium mb-2" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <label className="block text-sm font-medium mb-2" htmlFor="banner">
                Banner Image
              </label>
              <input
                type="file"
                id="banner"
                name="banner"
                onChange={handleFileChange}
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept="image/*"
              />
              {errors.banner && <p className="text-red-500 text-xs mt-1">{errors.banner}</p>}
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-700 text-white py-2 px-4 hover:bg-indigo-800 transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Category'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddCategory;

