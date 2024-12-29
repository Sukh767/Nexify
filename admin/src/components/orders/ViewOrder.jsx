import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetOrderByIDQuery } from "../../features/orders/orderApiSlice";

const ViewOrder = () => {
  const [isItemsExpanded, setIsItemsExpanded] = useState(false);
  const { id } = useParams();
  const { data: orderData, isLoading, error } = useGetOrderByIDQuery(id);
  //console.log(orderData);

  const order = orderData?.data;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order placed":
        return "bg-gray-300 text-gray-700";
      case "Order confirmed":
        return "bg-blue-300 text-blue-700";
      case "Packed":
        return "bg-indigo-300 text-indigo-700";
      case "Shipped":
        return "bg-purple-300 text-purple-700";
      case "Out for delivery":
        return "bg-orange-300 text-orange-700";
      case "Delivered":
        return "bg-green-300 text-green-700";
      case "Cancelled":
        return "bg-red-300 text-red-700";
      case "Returned":
        return "bg-yellow-300 text-yellow-700";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">Error: {error.message}</div>
    );
  if (!order)
    return <div className="text-center p-4">No order data available</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-gray-50">
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-lg mt-2">Order ID: {order._id}</p>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Order Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Order Number</p>
                <p className="font-medium">{order.orderNo}</p>
              </div>
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Order Date</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Order Status</p>
                <span
                  className={`inline-block px-3 py-2 rounded-full text-xs font-semibold ${getStatusColor(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Total Amount</p>
                <p className="font-semibold text-orange-400">
                  ${order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          {/* Customer Details */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <User className="mr-2" /> Customer Details
            </h2>
            <div className="bg-gray-500 p-4">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {order.address.fullName}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.address.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {order.address.phone}
              </p>
            </div>
          </section>

          {/* Items Ordered */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <Package className="mr-2" /> Items Ordered
            </h2>
            <div className="bg-gray-500 p-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsItemsExpanded(!isItemsExpanded)}
              >
                <span className="font-medium">
                  Total Items: {order.items.length}
                </span>
                {isItemsExpanded ? <ChevronUp /> : <ChevronDown />}
              </div>
              <AnimatePresence>
                {isItemsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <table className="w-full mt-4">
                      <thead>
                        <tr className="text-left text-gray-50">
                          <th className="pb-2">Item</th>
                          <th className="pb-2">Quantity</th>
                          <th className="pb-2">Price</th>
                          <th className="pb-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr
                            key={item?._id}
                            className="border-t border-gray-200"
                          >
                            <td className="py-2">Product {index + 1}</td>
                            <td className="py-2">{item?.quantity}</td>
                            <td className="py-2">${item?.price}</td>
                            <td className="py-2">${item?.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Payment Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <CreditCard className="mr-2" /> Payment Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Payment Status</p>
                <p
                  className={`font-medium ${
                    order.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {order.paymentStatus}
                </p>
              </div>
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Subtotal</p>
                <p className="font-medium">
                  $
                  {(
                    order.totalPrice -
                    order.shippingPrice -
                    order.taxPrice +
                    order.discountPrice
                  ).toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Shipping</p>
                <p className="font-medium">${order.shippingPrice.toFixed(2)}</p>
              </div>
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Tax</p>
                <p className="font-medium">${order.taxPrice.toFixed(2)}</p>
              </div>
              <div className="bg-gray-500 p-4">
                <p className="text-sm text-gray-50">Discount</p>
                <p className="font-medium text-green-600">
                  -${order.discountPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </section>

          {/* Shipping Details */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <Truck className="mr-2" /> Shipping Details
            </h2>
            <div className="bg-gray-500 p-4">
              <p>
                <span className="font-medium">Address:</span>{" "}
                {order.address.addressLine1}
              </p>
              {order.address.addressLine2 && (
                <p>{order.address.addressLine2}</p>
              )}
              <p>
                {order.address.city}, {order.address.state}{" "}
                {order.address.postalCode}
              </p>
              <p>{order.address.country}</p>
              <p className="mt-2">
                <span className="font-medium">Expected Delivery:</span>{" "}
                {formatDate(order.deliveryDate)}
              </p>
            </div>
          </section>

          {/* Additional Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Additional Information
            </h2>
            <div className="bg-gray-500 p-4">
              <p>
                <span className="font-medium">Coupon Applied:</span>{" "}
                {order.couponName || "None"}
              </p>
              <p>
                <span className="font-medium">Returnable:</span>{" "}
                {order.returnable ? "Yes" : "No"}
              </p>
              {order.refund.isRefunded && (
                <p>
                  <span className="font-medium">Refund Amount:</span> $
                  {order.refund.refundAmount.toFixed(2)}
                </p>
              )}
            </div>
          </section>

          {/*Downlaod Invoice*/}
          <section className="mt-8 flex justify-center">
            <a href="#" download className="block">
              <button className="flex items-center bg-blue-600 text-white gap-2 px-5 py-2 cursor-pointer font-semibold tracking-wider hover:bg-blue-500 duration-300 hover:gap-3 focus:outline-none focus:ring focus:ring-blue-400">
                <span>Download</span>
                <svg
                  fill="currentColor"
                  width="20px"
                  height="20px"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Download</title>
                  <polygon points="30 25 28.586 23.586 26 26.172 26 18 24 18 24 26.172 21.414 23.586 20 25 25 30 30 25"></polygon>
                  <path d="M18,28H8V4h8v6a2.0058,2.0058,0,0,0,2,2h6v3l2,0V10a.9092.9092,0,0,0-.3-.7l-7-7A.9087.9087,0,0,0,18,2H8A2.0058,2.0058,0,0,0,6,4V28a2.0058,2.0058,0,0,0,2,2H18ZM18,4.4,23.6,10H18Z"></path>
                </svg>
              </button>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
