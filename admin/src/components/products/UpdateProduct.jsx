import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "../../features/products/productsApiSlice";
import toast from "react-hot-toast";

const UpdateProduct = () => {
  const { id } = useParams();
  console.log("Product ID:", id);
  const { data: existingProduct, isLoading: isLoadingProduct } =
    useGetProductQuery(id);
  console.log("Existing product:", existingProduct);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [product, setProduct] = useState({
    productName: "",
    productUrl: "",
    brand: "",
    sizes: [],
    colors: [],
    parentCategory: "",
    short_description: "",
    description: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    mrp_price: "",
    selling_price: "",
    stock: "",
    weight: "",
    weight_unit: "",
    dimensions: "",
    featuredProduct: false,
    isTrending: false,
    isNewArrival: false,
    tags: "",
    status: "",
    discount: "",
  });

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setProduct({
        productName: existingProduct.data.productName,
        productUrl: existingProduct.data.productUrl,
        brand: existingProduct.data.brand,
        sizes: existingProduct.data.sizes,
        colors: existingProduct.data.colors,
        parentCategory: existingProduct.data.parentCategory,
        short_description: existingProduct.data.short_description,
        description: existingProduct.data.description,
        meta_title: existingProduct.data.meta_title,
        meta_description: existingProduct.data.meta_description,
        meta_keywords: existingProduct.data.meta_keywords,
        mrp_price: existingProduct.data.mrp_price,
        selling_price: existingProduct.data.selling_price,
        stock: existingProduct.data.stock,
        weight: existingProduct.data.weight,
        weight_unit: existingProduct.data.weight_unit,
        dimensions: existingProduct.data.dimensions,
        featuredProduct: existingProduct.data.featuredProduct,
        isTrending: existingProduct.data.isTrending,
        isNewArrival: existingProduct.data.isNewArrival,
        tags: existingProduct.data.tags,
        status: existingProduct.data.status,
        discount: existingProduct.data.discount,
      });
      setImages(existingProduct.data.images.map((image) => image.url));
    }
  }, [existingProduct]);

  console.log("set", product);

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
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
    }
  };

  const removeImage = (index, isNewImage = false) => {
    if (isNewImage) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (key === "sizes" || key === "colors") {
        formData.append(key, JSON.stringify(value));
      } else if (typeof value !== "undefined" && value !== null) {
        formData.append(key, value.toString());
      }
    });

    newImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await updateProduct({ id, formData });
      console.log("Product updated:", response);
      if (response.success) {
        toast.success(response.message || "Product updated successfully");
      }
      setSuccess(true);
    } catch (err) {
      setError("An error occurred while updating the product.");
    }
  };

  if (isLoadingProduct) {
    return <div>Loading product data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-transparent rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Update Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-50"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="productUrl"
              className="block text-sm font-medium text-gray-50"
            >
              Product URL
            </label>
            <input
              type="text"
              id="productUrl"
              name="productUrl"
              value={product.productUrl}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-50"
            >
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={product.brand}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="parentCategory"
              className="block text-sm font-medium text-gray-50"
            >
              Parent Category
            </label>
            <input
              type="text"
              id="parentCategory"
              name="parentCategory"
              value={product.parentCategory}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="short_description"
              className="block text-sm font-medium text-gray-50"
            >
              Short Description
            </label>
            <textarea
              id="short_description"
              name="short_description"
              value={product.short_description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-50"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="meta_title"
              className="block text-sm font-medium text-gray-50"
            >
              Meta Title
            </label>
            <input
              type="text"
              id="meta_title"
              name="meta_title"
              value={product.meta_title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="meta_description"
              className="block text-sm font-medium text-gray-50"
            >
              Meta Description
            </label>
            <textarea
              id="meta_description"
              name="meta_description"
              value={product.meta_description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="meta_keywords"
              className="block text-sm font-medium text-gray-50"
            >
              Meta Keywords
            </label>
            <input
              type="text"
              id="meta_keywords"
              name="meta_keywords"
              value={product.meta_keywords}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="mrp_price"
              className="block text-sm font-medium text-gray-50"
            >
              MRP Price
            </label>
            <input
              type="number"
              id="mrp_price"
              name="mrp_price"
              value={product.mrp_price}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="selling_price"
              className="block text-sm font-medium text-gray-50"
            >
              Selling Price
            </label>
            <input
              type="number"
              id="selling_price"
              name="selling_price"
              value={product.selling_price}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-50"
            >
              Stock
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-50"
            >
              Weight
            </label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={product.weight}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="weight_unit"
              className="block text-sm font-medium text-gray-50"
            >
              Weight Unit
            </label>
            <input
              type="text"
              id="weight_unit"
              name="weight_unit"
              value={product.weight_unit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="dimensions"
              className="block text-sm font-medium text-gray-50"
            >
              Dimensions
            </label>
            <input
              type="text"
              id="dimensions"
              name="dimensions"
              value={product.dimensions}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-50"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={product.tags}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-50"
            >
              Discount
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={product.discount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-50"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={product.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <input
              type="checkbox"
              id="featuredProduct"
              name="featuredProduct"
              checked={product.featuredProduct}
              onChange={handleChange}
              className="rounded border-gray-300 bg-gray-800 p-2 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <label
              htmlFor="featuredProduct"
              className="ml-2 text-sm text-gray-50"
            >
              Featured Product
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="isTrending"
              name="isTrending"
              checked={product.isTrending}
              onChange={handleChange}
              className="rounded border-gray-300 bg-gray-800 p-2 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <label htmlFor="isTrending" className="ml-2 text-sm text-gray-50">
              Trending
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="isNewArrival"
              name="isNewArrival"
              checked={product.isNewArrival}
              onChange={handleChange}
              className="rounded border-gray-300 bg-gray-800 p-2 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <label htmlFor="isNewArrival" className="ml-2 text-sm text-gray-50">
              New Arrival
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Sizes</h3>
          {product.sizes?.map((size, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Size"
                value={size.size || ""}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <input
                type="number"
                placeholder="Stock"
                value={size.stock || ""}
                onChange={(e) =>
                  handleSizeChange(index, "stock", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <button
                type="button"
                onClick={() => removeSize(index)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSize}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Size
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Colors</h3>
          {product.colors?.map((color, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                placeholder="Color Name"
                value={color.colorName || ""}
                onChange={(e) =>
                  handleColorChange(index, "colorName", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-800 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <input
                type="color"
                value={color.colorCode || "#000000"}
                onChange={(e) =>
                  handleColorChange(index, "colorCode", e.target.value)
                }
                className="w-12 h-10"
              />
              <button
                type="button"
                onClick={() => removeColor(index)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addColor}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Color
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Images</h3>
          <div className="flex flex-wrap gap-4 mb-2">
            {images.map((image, index) => (
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
              <div key={`new-${index}`} className="relative">
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
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 filefile:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}
        {success && (
          <div className="text-green-500">Product updated successfully!</div>
        )}

        <button
          type="submit"
          disabled={isUpdating}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProduct;
