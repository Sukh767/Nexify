import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, Edit, Check, X } from "lucide-react";
import {
  useEditOrderStatusMutation,
  useGetOrdersQuery,
} from "../../features/orders/orderApiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ErrorMessage from '../common/ErrorMessage';

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [editOrderStatus, { isLoading: statusLoading }] =
    useEditOrderStatusMutation();
  const [editingOrder, setEditingOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const orderStatuses = [
    "Order placed",
    "Order confirmed",
    "Packed",
    "Shipped",
    "Out for delivery",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  useEffect(() => {
    if (orders?.success && Array.isArray(orders.data)) {
      setFilteredOrders(orders.data);
    }
  }, [orders]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (orders?.success && Array.isArray(orders.data)) {
      const filtered = orders.data.filter(
        (order) =>
          order.orderId.toLowerCase().includes(term) ||
          order.address.fullName.toLowerCase().includes(term)
      );
      setFilteredOrders(filtered);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/view-order/${orderId}`);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewStatus(order.orderStatus);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await editOrderStatus({
        id: editingOrder._id,
        status: newStatus,
      }).unwrap();
      if (response.success) {
        toast.success("Order status updated successfully");
      } else {
        toast.error("Failed to update order status");
      }
      setEditingOrder(null);
      // Refresh the orders list
      refetch();
    } catch (err) {
      console.log("Error at update order status: ", err);
      toast.error("Failed to update order status");
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setNewStatus("");
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#A0E9FF]"></div>
      </div>
  );
  if (error) return (
    <>
    <ErrorMessage message={error.error} />
    </>
  )

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Order List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredOrders.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order.orderId.slice(-5)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order.address.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {editingOrder && editingOrder._id === order._id ? (
                    <select
                      value={newStatus}
                      onChange={handleStatusChange}
                      className="bg-gray-700 text-white rounded px-2 py-1"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.orderStatus === "Order placed"
                          ? "bg-gray-300 text-gray-700"
                          : order.orderStatus === "Order confirmed"
                          ? "bg-blue-300 text-blue-700"
                          : order.orderStatus === "Packed"
                          ? "bg-violet-300 text-violet-700"
                          : order.orderStatus === "Shipped"
                          ? "bg-cyan-300 text-cyan-700"
                          : order.orderStatus === "Out for delivery"
                          ? "bg-orange-300 text-orange-700"
                          : order.orderStatus === "Delivered"
                          ? "bg-green-300 text-green-700"
                          : order.orderStatus === "Cancelled"
                          ? "bg-red-300 text-red-700"
                          : order.orderStatus === "Returned"
                          ? "bg-purple-300 text-purple-700"
                          : ""
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-300 text-green-700"
                        : "bg-red-300 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {editingOrder && editingOrder._id === order._id ? (
                    <>
                      <button
                        className="text-green-400 hover:text-green-300 mr-2"
                        onClick={handleUpdateStatus}
                        disabled={statusLoading}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={handleCancelEdit}
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleViewOrder(order._id)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="text-green-400 hover:text-green-300"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit size={18} />
                      </button>
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OrdersTable;
