import React, { useState } from "react";
import { Plus, Minus, Upload, X } from "lucide-react";
import { useCreateProductMutation } from "../../features/products/productsApiSlice";
import toast from "react-hot-toast";

const AddProduct = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [product, setProduct] = useState({
    productName: "",
    productUrl: "",
    brand: "",
    sizes: [{ size: "", stock: 0 }],
    colors: [{ colorName: "", colorCode: "" }],
    parentCategory: "",
    child_category: "",
    short_description: "",
    description: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    featuredProduct: false,
    isTrending: false,
    isNewArrival: false,
    tags: "",
    status: "Active",
    weight: "",
    weight_unit: "kg",
    dimensions: "",
    mrp_price: "",
    selling_price: "",
    discount: "",
    stock: "",
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...product.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === "stock" ? parseInt(value) : value,
    };
    setProduct((prev) => ({ ...prev, sizes: newSizes }));
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...product.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setProduct((prev) => ({ ...prev, colors: newColors }));
  };

  const addSize = () => {
    setProduct((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", stock: 0 }],
    }));
  };

  const removeSize = (index) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  const addColor = () => {
    setProduct((prev) => ({
      ...prev,
      colors: [...prev.colors, { colorName: "", colorCode: "" }],
    }));
  };

  const removeColor = (index) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.productName)
      newErrors.productName = "Product name is required";
    if (!product.productUrl) newErrors.productUrl = "Product URL is required";
    if (!product.parentCategory)
      newErrors.parentCategory = "Parent category is required";
    if (!product.short_description)
      newErrors.short_description = "Short description is required";
    if (!product.description) newErrors.description = "Description is required";
    if (!product.meta_title) newErrors.meta_title = "Meta title is required";
    if (!product.meta_description)
      newErrors.meta_description = "Meta description is required";
    if (!product.meta_keywords)
      newErrors.meta_keywords = "Meta keywords are required";
    if (!product.mrp_price) newErrors.mrp_price = "MRP price is required";
    if (!product.selling_price)
      newErrors.selling_price = "Selling price is required";
    if (images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key === "sizes" || key === "colors") {
        formData.append(key, JSON.stringify(product[key]));
      } else {
        formData.append(key, product[key]);
      }
    });

    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      const response = await createProduct(formData).unwrap();
      setSuccessMessage("Product created successfully!");
      // Reset form or redirect
      console.log("Product created:", response);
      if (response.success) {
        toast.success("Product created successfully");
      }
      if (response.success) {
        setProduct({
          productName: "",
          productUrl: "",
          brand: "",
          sizes: [{ size: "", stock: 0 }],
          colors: [{ colorName: "", colorCode: "" }],
          parentCategory: "",
          child_category: "",
          short_description: "",
          description: "",
          meta_title: "",
          meta_description: "",
          meta_keywords: "",
          featuredProduct: false,
          isTrending: false,
          isNewArrival: false,
          tags: "",
          status: "Active",
          weight: "",
          weight_unit: "kg",
          dimensions: "",
          mrp_price: "",
          selling_price: "",
          discount: "",
          stock: "",
        });
        setImages([]);
        setErrors({});
      }
    } catch (err) {
      console.log("Create Product Error:", err);
      toast.error(err.data?.message || "Failed to create product");
      setErrors({ submit: err.data?.message || "Failed to create product" });
    }
  };


  return (
    <>
    {isLoading ? (
      <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
      </div>
    </div>
    ): 
    
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 shadow-md">
      <h2 className="text-2xl font-bold font-mono mb-6 mt-6">ADD NEW PRODUCT</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Product Name</label>
            <input
              type="text"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              placeholder="Enter Product Name"
              className="w-full bg-gray-700 p-2 "
            />
            {errors.productName && (
              <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Product URL</label>
            <input
              type="text"
              name="productUrl"
              value={product.productUrl}
              onChange={handleChange}
              placeholder=" Enter productUrl"
              className="w-full bg-gray-700 p-2 "
            />
            {errors.productUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.productUrl}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Brand</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              placeholder="Enter Product Brand"
              className="w-full bg-gray-700 p-2 "
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Parent Category</label>
            <input
              type="text"
              name="parentCategory"
              value={product.parentCategory}
              onChange={handleChange}
              placeholder="Select Parent Category"
              className="w-full bg-gray-700 p-2 "
            />
            {errors.parentCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.parentCategory}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Child Category</label>
            <input
              type="text"
              name="child_category"
              value={product.child_category}
              onChange={handleChange}
              placeholder="Select Child Category"
              className="w-full bg-gray-700 p-2 "
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Short Description</label>
            <textarea
              name="short_description"
              value={product.short_description}
              onChange={handleChange}
              placeholder="Write Short Description"
              className="w-full bg-gray-700 p-2 "
              rows="3"
            ></textarea>
            {errors.short_description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.short_description}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Write Description"
              className="w-full bg-gray-700 p-2 "
              rows="5"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Meta Title</label>
            <input
              type="text"
              name="meta_title"
              value={product.meta_title}
              onChange={handleChange}
              placeholder="Write Meta Title"
              className="w-full bg-gray-700 p-2 "
            />
            {errors.meta_title && (
              <p className="text-red-500 text-sm mt-1">{errors.meta_title}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Meta Description</label>
            <textarea
              name="meta_description"
              value={product.meta_description}
              onChange={handleChange}
              placeholder="Write Meta Description"
              className="w-full bg-gray-700 p-2 "
              rows="3"
            ></textarea>
            {errors.meta_description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.meta_description}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Meta Keywords</label>
            <input
              type="text"
              name="meta_keywords"
              value={product.meta_keywords}
              onChange={handleChange}
              placeholder="Write Meta Keywords(separated by comma)"
              className="w-full bg-gray-700 p-2 "
            />
            {errors.meta_keywords && (
              <p className="text-red-500 text-sm mt-1">
                {errors.meta_keywords}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Tags</label>
            <input
              type="text"
              name="tags"
              value={product.tags}
              onChange={handleChange}
              placeholder="Write Tags(separated by comma)"
              className="w-full bg-gray-700 p-2 "
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">MRP Price</label>
            <input
              type="number"
              name="mrp_price"
              value={product.mrp_price}
              onChange={handleChange}
              placeholder="Enter MRP Price"
              className="w-full bg-gray-700 p-2 "
            />
            {errors.mrp_price && (
              <p className="text-red-500 text-sm mt-1">{errors.mrp_price}</p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Selling Price</label>
            <input
              type="number"
              name="selling_price"
              value={product.selling_price}
              onChange={handleChange}
              placeholder="Enter Selling Price"
              className="w-full bg-gray-700 p-2 "
            />
            {errors.selling_price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.selling_price}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Discount</label>
            <input
              type="number"
              name="discount"
              value={product.discount}
              onChange={handleChange}
              placeholder="Enter Discount Percentage(Don't use '%' sign)"
              className="w-full bg-gray-700 p-2 "
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="Enter Stock"
              className="w-full bg-gray-700 p-2 "
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Sizes</label>
          {product.sizes.map((size, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={size.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
                placeholder="Size"
                className="p-2  bg-gray-700"
              />
              <input
                type="number"
                value={size.stock}
                onChange={(e) =>
                  handleSizeChange(index, "stock", e.target.value)
                }
                placeholder="Stock"
                className="p-2  bg-gray-700"
              />
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="text-red-500"
              >
                <Minus size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSize}
            className="text-blue-500 flex items-center"
          >
            <Plus size={20} /> Add Size
          </button>
        </div>

        <div>
          <label className="block mb-2 font-medium">Colors</label>
          {product.colors.map((color, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={color.colorName}
                onChange={(e) =>
                  handleColorChange(index, "colorName", e.target.value)
                }
                placeholder="Color Name"
                className="p-2  bg-gray-700"
              />
              <input
                type="color"
                value={color.colorCode}
                onChange={(e) =>
                  handleColorChange(index, "colorCode", e.target.value)
                }
                className="p-2  h-10 w-10"
              />
              <button
                type="button"
                onClick={() => removeColor(index)}
                className="text-red-500"
              >
                <Minus size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addColor}
            className="text-blue-500 flex items-center"
          >
            <Plus size={20} /> Add Color
          </button>
        </div>

        <div>
          <label className="block mb-2 font-medium">Images</label>
          <div className="flex flex-wrap gap-4 mb-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Product ${index + 1}`}
                  className="w-24 h-24 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white-full p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <label className="cursor-pointer bg-purple-500 text-white py-2 px-4 inline-flex items-center">
            <Upload size={20} className="mr-2" />
            Upload Images
            <input
              type="file"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="hidden"
            />
          </label>
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="featuredProduct"
              checked={product.featuredProduct}
              onChange={handleChange}
              className="mr-2"
            />
            Featured Product
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isTrending"
              checked={product.isTrending}
              onChange={handleChange}
              className="mr-2"
            />
            Trending
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={product.isNewArrival}
              onChange={handleChange}
              className="mr-2"
            />
            New Arrival
          </label>
        </div>

        <div>
          <label className="block mb-2 font-medium">Status</label>
          <select
            name="status"
            value={product.status}
            onChange={handleChange}
            placeholder="Select Status"
            className="w-full bg-gray-700 p-2 "
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {errors.submit && (
          <p className="text-red-500 text-sm mt-1">{errors.submit}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-sm mt-1">{successMessage}</p>
        )}

        <button
          type="submit"
          className=" w-full bg-blue-700 text-white py-2 px-4 hover:bg-indigo-800 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
    }

    </>
  );
};

export default AddProduct;
