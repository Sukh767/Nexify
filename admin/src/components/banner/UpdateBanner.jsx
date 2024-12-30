import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateBannerMutation, useGetBannerByIdQuery } from '../../features/banner/bannerApiSlice';
import toast from 'react-hot-toast';

const UpdateBanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateBanner, { isLoading }] = useUpdateBannerMutation();
  const { data: bannerData, isLoading: isFetching, error: fetchError, refetch:refetchBanners } = useGetBannerByIdQuery(id);
  console.log(bannerData);

  const [formData, setFormData] = useState({
    bannerName: '',
    bannerAlt: '',
    bannerType: '',
    description: '',
    status: 'Active',
  });
  const [newBannerImages, setNewBannerImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  const bannerTypes = ['Homepage', 'Category', 'Product', 'Promotional'];

  useEffect(() => {
    if (bannerData) {
      setFormData({
        bannerName: bannerData.data.bannerName || '',
        bannerAlt: bannerData.data.bannerAlt || '',
        bannerType: bannerData.data.bannerType || '',
        description: bannerData.data.description || '',
        status: bannerData.data.status || 'Active',
      });
      setPreviewImages(bannerData.data.bannerImages.map((img) => img.url));
    }
  }, [bannerData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewBannerImages(files);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bannerName) newErrors.bannerName = 'Banner name is required';
    if (!formData.bannerAlt) newErrors.bannerAlt = 'Banner alt text is required';
    if (!formData.bannerType) newErrors.bannerType = 'Banner type is required';
    if (!formData.description) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    newBannerImages.forEach(image => {
      formDataToSend.append('bannerImages', image);
    });

    try {
      const response = await updateBanner({ id, banner: formDataToSend }).unwrap();
      if(response.status === 'successful' || response.success){
        // Show a success toast
        toast.success(response.message || 'Banner updated successfully!');
        // Trigger a re-fetch of banners
        refetchBanners();
      }
      navigate('/banner');
    } catch (err) {
      console.error('Failed to update the banner:', err);
      setErrors({ general: 'Failed to update banner' });
    }
  };

  if (isFetching) return <div className="text-center text-white text-2xl">Loading...</div>;
  if (fetchError) return <div className="text-center text-red-500 text-2xl">Error: {fetchError.message}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen text-white p-8"
    >
      <div className="max-w-4xl mx-auto overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-mono font-bold mb-6">UPDATE BANNER</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium mb-2" htmlFor="bannerName">
                  Banner Name
                </label>
                <input
                  type="text"
                  id="bannerName"
                  name="bannerName"
                  value={formData.bannerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter banner name"
                />
                {errors.bannerName && <p className="text-red-500 text-xs mt-1">{errors.bannerName}</p>}
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <label className="block text-sm font-medium mb-2" htmlFor="bannerAlt">
                  Banner Alt Text
                </label>
                <input
                  type="text"
                  id="bannerAlt"
                  name="bannerAlt"
                  value={formData.bannerAlt}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter alt text"
                />
                {errors.bannerAlt && <p className="text-red-500 text-xs mt-1">{errors.bannerAlt}</p>}
              </motion.div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium mb-2" htmlFor="bannerType">
                Banner Type
              </label>
              <select
                id="bannerType"
                name="bannerType"
                value={formData.bannerType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select banner type</option>
                {bannerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.bannerType && <p className="text-red-500 text-xs mt-1">{errors.bannerType}</p>}
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <label className="block text-sm font-medium mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter banner description"
                rows="4"
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
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
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="block text-sm font-medium mb-2" htmlFor="bannerImages">
                Add New Banner Images
              </label>
              <input
                type="file"
                id="bannerImages"
                name="bannerImages"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </motion.div>
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {previewImages.map((preview, index) => (
                  <img key={index} src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                ))}
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-700 text-white py-2 px-4 hover:bg-indigo-800 transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Banner'}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateBanner;

