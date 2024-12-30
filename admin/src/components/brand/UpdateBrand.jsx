import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

import { Upload, X } from 'lucide-react';
import { useGetBrandByIdQuery, useUpdateBrandMutation } from '../../features/brand/brandApiSlice';
import toast from 'react-hot-toast';

const UpdateBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();
  const { data: brandData, isLoading: isFetching, error: fetchError } = useGetBrandByIdQuery(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: true,
  });
  const [logo, setLogo] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (brandData) {
      setFormData({
        name: brandData.data.name || '',
        description: brandData.data.description || '',
        status: brandData.data.status || false,
      });
      if (brandData.data.logo && brandData.data.logo.length > 0) {
        setPreviewLogo(brandData.data.logo[0].url);
      }
    }
  }, [brandData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogo(null);
    setPreviewLogo(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Brand name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const brandData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'status') {
        brandData.append(key, formData[key] ? 'true' : 'false');
      } else {
        brandData.append(key, formData[key]);
      }
    });
    if (logo) brandData.append('logo', logo);

    try {
      const reponse = await updateBrand({ id, brand: brandData }).unwrap();
      if(reponse.success){
        toast.success(Response.message || 'Brand updated successfully');
      }
      navigate('/brand');
    } catch (err) {
      toast.error('Failed to update brand');
      console.error('Failed to update the brand:', err);
      setErrors({ general: 'Failed to update brand' });
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
      <div className="max-w-2xl mx-auto overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 font-mono">UPDATE BRAND DETAILS</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="name">
                Brand Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand description"
                rows="4"
              ></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-300 font-medium">Active</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="logo">
                Logo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed">
                <div className="space-y-1 text-center">
                  {previewLogo ? (
                    <div className="relative">
                      <img src={previewLogo} alt="Logo preview" className="mx-auto h-32 w-32 object-cover" />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="logo"
                      className="relative cursor-pointer bg-gray-700 font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="logo" name="logo" type="file" className="sr-only" onChange={handleLogoChange} accept="image/*" />
                    </label>
                    <p className="pl-1 text-gray-400">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition duration-300 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Brand'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default UpdateBrand;

