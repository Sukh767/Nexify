import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  useGetVariantByIdQuery,
  useUpdateVariantMutation,
} from "../../features/variants/variantsApiSlice";

const EditVariant = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateVariant, { isLoading }] = useUpdateVariantMutation();
  const {
    data: variantData,
    isLoading: isLoadingVariant,
    refetch,
  } = useGetVariantByIdQuery(id);
  const [formData, setFormData] = useState({
    product_name: "",
    product_url: "",
    product_id: "",
    brand: "",
    size: "",
    colors: "#000000", // Default colors set to black as hex string
    parentCategory: "",
    child_category: "",
    sort_description: "",
    description: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    skucode: "",
    status: "",
    newarrivedproduct: false,
    trendingproduct: false,
    featuredproduct: false,
    weight: "",
    weight_type: "",
    mrp_price: "",
    selling_price: "",
    stock: "",
  });
  const [banner, setBanner] = useState([]); // URLs of existing images
  const [newImages, setNewImages] = useState([]); // Newly uploaded files

  useEffect(() => {
    if (variantData) {
      setFormData({
        product_id: variantData.data.product_id,
        product_name: variantData.data.product_name,
        product_url: variantData.data.product_url,
        brand: variantData.data.brand,
        size: variantData.data.size,
        colors: variantData.data.colors || "#000000", // Use hex or fallback to black
        parentCategory: variantData.data.parentCategory,
        child_category: variantData.data.child_category,
        sort_description: variantData.data.sort_description,
        description: variantData.data.description,
        meta_title: variantData.data.meta_title,
        meta_description: variantData.data.meta_description,
        meta_keywords: variantData.data.meta_keywords,
        skucode: variantData.data.skucode,
        status: variantData.data.status,
        newarrivedproduct: variantData.data.newarrivedproduct,
        trendingproduct: variantData.data.trendingproduct,
        featuredproduct: variantData.data.featuredproduct,
        weight: variantData.data.weight,
        weight_type: variantData.data.weight_type,
        mrp_price: variantData.data.mrp_price,
        selling_price: variantData.data.selling_price,
        stock: variantData.data.stock,
      });

      setBanner(variantData.data.product_image.map((image) => image.url));
    }
  }, [variantData]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]); // Append to `newImages`
  };

  const removeImage = (index, isNewImage = false) => {
    if (isNewImage) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setBanner((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    // Combine existing and new images
    const allImages = [...banner, ...newImages];
    allImages.forEach((image) => {
      if (typeof image === "string") {
        // Append existing image URLs
        formDataToSend.append("existingImages", image);
      } else {
        // Append new image files
        formDataToSend.append("banner", image);
      }
    });

    // Append other form fields, ensuring colors is sent as a hex string
    Object.keys(formData).forEach((key) => {
      if (key === "colors") {
        formDataToSend.append(key, formData[key]); // Send colors as a hex string
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await updateVariant({
        variant: formDataToSend,
        id,
      }).unwrap();

      console.log("Variant updated:", response);
      if (response.status === "successful") {
        toast.success(response.message || "Variant updated successfully!");
      }
      navigate("/variants");
      refetch();
    } catch (err) {
      console.error("Failed to update variant:", err);
      toast.error(err.data?.message || "Failed to update variant.");
    }
  };

  if (isLoadingVariant) {
    return (
      <div className="text-white text-center">Loading variant data...</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen text-white p-8"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold text-white text-center font-mono mt-6"
      >
        EDIT VARIANT PRODUCT
      </motion.h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-gray-900 p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div whileHover={{ scale: 1.02 }} className="col-span-2">
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="product_name"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="product_url"
            >
              Product URL
            </label>
            <input
              type="text"
              id="product_url"
              name="product_url"
              value={formData.product_url}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="product_id"
            >
              Product ID
            </label>
            <input
              type="text"
              id="product_id"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="brand"
            >
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="size"
            >
              Size
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="colors"
            >
              Color
            </label>
            <input
              type="color"
              id="colors"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="parentCategory"
            >
              Parent Category
            </label>
            <input
              type="text"
              id="parentCategory"
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="child_category"
            >
              Child Category
            </label>
            <input
              type="text"
              id="child_category"
              name="child_category"
              value={formData.child_category}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="col-span-2">
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="sort_description"
            >
              Short Description
            </label>
            <textarea
              id="sort_description"
              name="sort_description"
              value={formData.sort_description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="col-span-2">
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="description"
            >
              Full Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="meta_title"
            >
              Meta Title
            </label>
            <input
              type="text"
              id="meta_title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="meta_description"
            >
              Meta Description
            </label>
            <input
              type="text"
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="meta_keywords"
            >
              Meta Keywords
            </label>
            <input
              type="text"
              id="meta_keywords"
              name="meta_keywords"
              value={formData.meta_keywords}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="skucode"
            >
              SKU Code
            </label>
            <input
              type="text"
              id="skucode"
              name="skucode"
              value={formData.skucode}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="newarrivedproduct"
                name="newarrivedproduct"
                checked={formData.newarrivedproduct}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-400 font-medium">
                New Arrived Product
              </span>
            </label>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="trendingproduct"
                name="trendingproduct"
                checked={formData.trendingproduct}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-400 font-medium">
                Trending Product
              </span>
            </label>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="featuredproduct"
                name="featuredproduct"
                checked={formData.featuredproduct}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-400 font-medium">
                Featured Product
              </span>
            </label>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="weight"
            >
              Weight
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="weight_type"
            >
              Weight Type
            </label>
            <select
              id="weight_type"
              name="weight_type"
              value={formData.weight_type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="kg">Kilogram (kg)</option>
              <option value="g">Gram (g)</option>
              <option value="lb">Pound (lb)</option>
              <option value="oz">Ounce (oz)</option>
            </select>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="mrp_price"
            >
              MRP Price
            </label>
            <input
              type="number"
              id="mrp_price"
              name="mrp_price"
              value={formData.mrp_price}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="selling_price"
            >
              Selling Price
            </label>
            <input
              type="number"
              id="selling_price"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label
              className="block text-sm font-medium text-gray-400 mb-2"
              htmlFor="stock"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </motion.div>

          <div>
            <label htmlFor="product_name" className="block font-medium">
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} className="col-span-2">
            <h3 className="font-semibold mb-2">Images</h3>
            <div className="flex flex-wrap gap-4 mb-2">
              {banner.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              ))}
              {newImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`New Product ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, true)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="banner" className="block text-sm font-medium mb-2">
              Product Image
            </label>
            <input
              type="file"
              id="banner"
              name="banner"
              onChange={handleImageChange}
              multiple
              className="w-full px-3 py-2 bg-gray-700 text-white focus:outline-none"
            />
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full bg-blue-700 text-white py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {isLoading ? "Updating..." : "Update Variant"}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default EditVariant;
