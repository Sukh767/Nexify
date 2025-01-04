import React, { useState, useEffect } from "react";

import { Eye, Loader2, Search, Edit, Trash2, PackagePlus } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDeleteVariantMutation, useGetVariantsQuery } from "../../features/variants/variantsApiSlice";
import toast from "react-hot-toast";

const VariantsTable = () => {
  const { data: variants, isLoading, error, refetch } = useGetVariantsQuery();
  const [ deleteVariant, {isLoading: deleteloading }] = useDeleteVariantMutation();
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (
      variants &&
      variants.status === "successful" &&
      Array.isArray(variants.data)
    ) {
      setFilteredVariants(variants.data);
    } else {
      setFilteredVariants([]);
    }
  }, [variants]);
  console.log(variants);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (
      variants &&
      variants.status === "successful" &&
      Array.isArray(variants.data)
    ) {
      const filtered = variants.data.filter(
        (variant) =>
          variant.product_name.toLowerCase().includes(term) ||
          variant.brand.toLowerCase().includes(term)
      );
      setFilteredVariants(filtered);
    }
  };

  const deleteVariantHandler = async(id) => {
    // Implement delete functionality
    try {
      const response = await deleteVariant(id).unwrap();
      console.log(response);
      if(response.status === "successful") {
        toast.success(response.message || "Variant deleted successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error.data.message || "Failed to delete variant");
      console.log("Error in deleteVariantHandler:", error);
    }
    console.log("Delete variant", id);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700 p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Product Variant List
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search variants..."
            className="bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-500" size={24} />
        </div>
      )}
      {error && <div className="text-red-500">Error: {error.data}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                MRP Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Selling Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                New Arrival
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredVariants.map((variant) => (
              <motion.tr
                key={variant._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  <img
                    src={variant.product_image[0]?.url || "/default-image.jpg"}
                    alt={variant.product_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {variant.product_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {variant.brand}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    {/* Color box */}
                    <span
                      className="inline-block w-6 h-6 rounded-full border border-gray-400"
                      style={{ backgroundColor: variant.colors }}
                    ></span>
                    {/* Color code */}
                    {/* <span>{variant.colors}</span> */}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {variant.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ₹{variant.mrp_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ₹{variant.selling_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {variant.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      variant.status === "Active"
                        ? "bg-green-300 text-green-800"
                        : "bg-red-300 text-red-700"
                    }`}
                  >
                    {variant.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      variant.newarrivedproduct
                        ? "bg-purple-300 text-purple-900"
                        : "bg-red-300 text-red-700"
                    }`}
                  >
                    {variant.newarrivedproduct ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <Link to={`/variants/add/${variant._id}`}>
                    <button
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                      onClick={() => console.log("create Variant", variant._id)}
                    >
                      <PackagePlus size={19} />
                    </button>
                  </Link>
                  <Link to={`/variants/${variant._id}`}>
                  <button
                    className="text-blue-400 hover:text-blue-300 mr-2"
                    onClick={() => console.log("View Variant", variant._id)}
                  >
                    <Edit size={18} />
                  </button>
                  </Link>
                  {deleteloading && 
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => deleteVariantHandler(variant._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                  }
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default VariantsTable;
