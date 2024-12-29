import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../features/products/productsApiSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { data: productsResponse, isLoading, error, refetch } = useGetAllProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  useEffect(() => {
    if (
      productsResponse &&
      productsResponse.success &&
      Array.isArray(productsResponse.data)
    ) {
      setFilteredProducts(productsResponse.data);
    } else {
      setFilteredProducts([]);
    }
  }, [productsResponse]);

  const deleteProductHandler = async (id) => {
    try {
      const response = await deleteProduct(id).unwrap();
      console.log(response);
      setFilteredProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
      if(response.success)
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (
      productsResponse &&
      productsResponse.success &&
      Array.isArray(productsResponse.data)
    ) {
      const filtered = productsResponse.data.filter(
        (product) =>
          product.productName.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

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
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredProducts.map((product) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  <img
                    src={product.images[0]?.url || "/default-image.jpg"}
                    alt={product.productName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {product.productName}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.brand}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.colors.map((color, index) => (
                    <span
                      key={index}
                      className="inline-block rounded-full px-2 font-semibold"
                      style={{ backgroundColor: `${color.colorCode}` }}
                    >
                      {color.colorName}
                    </span>
                  ))}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ₹{product.selling_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.sizes.reduce((total, size) => total + size.stock, 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <Link to={`/products/${product._id}`}>
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => console.log("Edit Product", product._id)}
                  >
                    <Edit size={18} />
                  </button>
                  </Link>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => deleteProductHandler(product._id)}
                    disabled={isDeleting}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductsTable;

