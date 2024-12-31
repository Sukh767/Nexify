import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from '../../features/category/categoryApiSlice';
import { X, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import ErrorMessage from '../common/ErrorMessage';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const { data: categoryData, isLoading: isFetching, error: fetchError, refetch:refetchCategory } = useGetCategoryByIdQuery(id);

  const [formData, setFormData] = useState({
    category_name: '',
    category_url: '',
    editor: '',
    meta_description: '',
    meta_title: '',
    meta_keywords: '',
    parentCategory: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (categoryData?.data) {
      const data = categoryData.data;
      setFormData({
        category_name: data.name || '',
        category_url: data.url || '',
        editor: data.description || '',
        meta_description: data.metaDescription || '',
        meta_title: data.metaTitle || '',
        meta_keywords: data.metaKeywords || '',
        parentCategory: data.parentCategory ? data.parentCategory[0] : '',
        status: data.status || 'Active',
      });
      if (data.banner?.[0]) {
        setBanner(data.banner[0]); // Set the banner object
        setPreviewImage(data.banner[0].url); // Set the preview image URL
      }
    }
  }, [categoryData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setBanner(null);
    setPreviewImage(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category_name) newErrors.category_name = 'Category name is required';
    if (!formData.category_url) newErrors.category_url = 'Category URL is required';
    if (!formData.editor) newErrors.editor = 'Description is required';
    if (!formData.meta_description) newErrors.meta_description = 'Meta description is required';
    if (!formData.meta_title) newErrors.meta_title = 'Meta title is required';
    if (!formData.meta_keywords) newErrors.meta_keywords = 'Meta keywords are required';
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'banner' && banner instanceof File) {
        form.append('banner', banner, banner.name);
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await updateCategory({ id, data: form }).unwrap();
      console.log('Category updated:', response);
      navigate('/categories');
      if(response.success) {
        toast.success('Category updated successfully');
      }
        refetchCategory();
    } catch (err) {
        toast.error('Failed to update category');
      console.error('Failed to update the category:', err);
      setErrors(err.data?.error || { general: 'Failed to update category' });
    }
  };

  if (isFetching)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#A0E9FF]"></div>
      </div>
    );
    if (fetchError) return (
      <>
      <ErrorMessage message={fetchError.message || fetchError.status} />
      </>
    )
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen  text-white p-8"
    >
      <div className="max-w-4xl mx-auto overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 font-mono">UPDATE CATEGORY DETAILS</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
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
              </div>
              <div>
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
              </div>
            </div>
            <div>
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
              {errors.editor && <p className="text-red-500 text-xs mt-1">{errors.editor}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
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
                {errors.meta_title && <p className="text-red-500 text-xs mt-1">{errors.meta_title}</p>}
              </div>
              <div>
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
                {errors.meta_description && <p className="text-red-500 text-xs mt-1">{errors.meta_description}</p>}
              </div>
            </div>
            <div>
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
              {errors.meta_keywords && <p className="text-red-500 text-xs mt-1">{errors.meta_keywords}</p>}
            </div>
            <div>
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
            </div>
            <div>
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
              {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="banner">
                Banner Image
              </label>
              <div className="flex items-center ">
                <input
                  type="file"
                  id="banner"
                  name="banner"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="banner"
                  className="cursor-pointer bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition duration-300"
                >
                  {previewImage ? 'Change Image' : 'Select Image'}
                </label>
                {previewImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-red-400 text-white p-2 hover:bg-red-600 transition duration-300 ml-2"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
              {previewImage && (
                <div className="mt-4 relative w-full h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={previewImage}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-700 text-white py-2 px-4 hover:bg-indigo-700 transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Category'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EditCategory;

