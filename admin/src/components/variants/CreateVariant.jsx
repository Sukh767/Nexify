import React, { useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { useAddVariantMutation } from "../../features/variants/variantsApiSlice";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductQuery } from "../../features/products/productsApiSlice";

const CreateVariant = () => {
  const { id } = useParams();
  const [addVariant, { isLoading }] = useAddVariantMutation();
  const { data: productDetails, isLoading:getProductLoading, error:getProductError } = useGetProductQuery(id);
  console.log(productDetails);
  const naviagte = useNavigate();
  const [formData, setFormData] = useState({
    product_name: productDetails?.data?.productName || "",
    product_url: productDetails?.data?.productUrl || "",
    product_id: id,
    brand: productDetails?.data?.brand || "",
    size: "",
    colors: "",
    parentCategory: productDetails?.data?.parentCategory || "",
    child_category: "",
    sort_description: productDetails?.data?.short_description || "",
    description: productDetails?.data?.description || "",
    meta_title: productDetails?.data?.meta_title || "",
    meta_description: productDetails?.data?.meta_description || "",
    meta_keywords: productDetails?.data?.meta_keywords || "",
    skucode: productDetails?.data?.skuCode || "",
    status: "Active",
    newarrivedproduct: false,
    trendingproduct: false,
    featuredproduct: false,
    weight: productDetails?.data?.weight || "",
    weight_type: "kg",
    mrp_price: productDetails?.data?.mrp_price || "",
    selling_price: productDetails?.data?.selling_price || "",
    stock: productDetails?.data?.stock || "",
  });
  const [error, setError] = useState(null);
  const [banner, setBanner] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setBanner([...banner, ...files]);
  };

  const removeImage = (index) => {
    setBanner(banner.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Fix typo
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === "boolean") {
        formDataToSend.append(key, formData[key] ? "true" : "false");
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    if (banner) {
      banner.forEach((banner, index) => {
        formDataToSend.append(`banner`, banner);
      });
    }
  
    try {
      const response = await addVariant(formDataToSend).unwrap();
      // Reset form or show success message
      if(response.status === "successful") {
        toast.success(response.message || "Variant created successfully.");
        setFormData({
          product_name: "",
          product_url: "",
          product_id: id,
          brand: "",
          size: "",
          colors: "",
          parentCategory: "",
          child_category: "",
          sort_description: "",
          description: "",
          meta_title: "",
          meta_description: "",
          meta_keywords: "",
          skucode: "",
          status: "Active",
          newarrivedproduct: false,
          trendingproduct: false,
          featuredproduct: false,
          weight: "",
          weight_type: "kg",
          mrp_price: "",
          selling_price: "",
          stock: "",
        });
        setBanner([]);
      }
      naviagte("/variants");
      console.log(response);
    } catch (err) {
      setError(
        err.data?.error?.message || "An error occurred while creating the variant."
      );
      toast.error(err?.data?.message || "Failed to create variant" || err?.data?.error?.message);
      console.log(err);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 shadow-md">
      <h1 className="text-2xl font-bold mb-8 mt-6">CREATE PRODUCT VARIANTS</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="product_name"
              className="block text-sm font-medium mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="product_url"
              className="block text-sm font-medium mb-1"
            >
              Product URL
            </label>
            <input
              type="text"
              id="product_url"
              name="product_url"
              value={formData.product_url}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="product_id"
              className="block text-sm font-medium mb-1"
            >
              Product ID
            </label>
            <input
              type="text"
              id="product_id"
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="brand" className="block text-sm font-medium mb-1">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="size" className="block text-sm font-medium mb-1">
              Size
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="colors" className="block text-sm font-medium mb-1">
              Color
            </label>
            <input
              type="color"
              id="colors"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="parentCategory"
              className="block text-sm font-medium mb-1"
            >
              Parent Category
            </label>
            <input
              type="text"
              id="parentCategory"
              name="parentCategory"
              value={formData.parentCategory}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="child_category"
              className="block text-sm font-medium mb-1"
            >
              Child Category
            </label>
            <input
              type="text"
              id="child_category"
              name="child_category"
              value={formData.child_category}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="sort_description"
            className="block text-sm font-medium mb-1"
          >
            Short Description
          </label>
          <textarea
            id="sort_description"
            name="sort_description"
            value={formData.sort_description}
            onChange={handleChange}
            required
            rows="3"
            className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Full Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              htmlFor="meta_title"
              className="block text-sm font-medium mb-1"
            >
              Meta Title
            </label>
            <input
              type="text"
              id="meta_title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="meta_description"
              className="block text-sm font-medium mb-1"
            >
              Meta Description
            </label>
            <input
              type="text"
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="meta_keywords"
              className="block text-sm font-medium mb-1"
            >
              Meta Keywords
            </label>
            <input
              type="text"
              id="meta_keywords"
              name="meta_keywords"
              value={formData.meta_keywords}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="skucode" className="block text-sm font-medium mb-1">
              SKU Code
            </label>
            <input
              type="text"
              id="skucode"
              name="skucode"
              value={formData.skucode}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="newarrivedproduct"
              name="newarrivedproduct"
              checked={formData.newarrivedproduct}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="newarrivedproduct" className="ml-2 block text-sm">
              New Arrival
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="trendingproduct"
              name="trendingproduct"
              checked={formData.trendingproduct}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="trendingproduct" className="ml-2 block text-sm">
              Trending
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featuredproduct"
              name="featuredproduct"
              checked={formData.featuredproduct}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featuredproduct" className="ml-2 block text-sm">
              Featured
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium mb-1">
              Weight
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="weight_type"
              className="block text-sm font-medium mb-1"
            >
              Weight Type
            </label>
            <select
              id="weight_type"
              name="weight_type"
              value={formData.weight_type}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="lb">lb</option>
              <option value="oz">oz</option>
            </select>
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-1">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="mrp_price"
              className="block text-sm font-medium mb-1"
            >
              MRP Price
            </label>
            <input
              type="number"
              id="mrp_price"
              name="mrp_price"
              value={formData.mrp_price}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="selling_price"
              className="block text-sm font-medium mb-1"
            >
              Selling Price
            </label>
            <input
              type="number"
              id="selling_price"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
              step="0.01"
              required
              className="w-full bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-1">
              Product Images
            </label>
            <div className="flex flex-wrap gap-4 mb-2">
              {banner.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Product ${index + 1}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPEG, PNG, JPG Only (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 transition duration-300"
        >
          {isLoading ? (
            <>"Creating product... " <Loader2 className="animate-spin mx-auto" /></>
          ) : (
            "Create Variant"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateVariant;
