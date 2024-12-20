import Cart from "../../models/cart.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/Product/product.model.js";
import ProductVariant from "../../models/Product/productVariant.model.js";
import { v4 as uuid } from "uuid";


//TODO: NEED TO FIX THIS PLACE ORDER LIKE SET IMAGE AND EMAIL TEMPLATE
const calculateOrderTotals = async (items) => {
  let totalItemsPrice = 0;

  const processedItems = await Promise.all(
    items.map(async (item) => {
      // Fetch product details
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Fetch product variant
      const variant = await ProductVariant.findById(item.variant);
      if (!variant) {
        throw new Error(`Product variant not found: ${item.variant}`);
      }

      // Validate stock
      if (variant.stock < item.quantity) {
        throw new Error(`Insufficient stock for product variant: ${variant._id}`);
      }

      // Determine price (use variant's selling price if available)
      const itemPrice = variant.selling_price || product.selling_price;
      const itemDiscount = product.discount || 0;
      const itemTotal = (itemPrice - itemDiscount) * item.quantity;
      
      totalItemsPrice += itemTotal;

      return {
        productId: item.productId,
        variant: item.variant,
        quantity: item.quantity,
        price: itemPrice,
        total: itemTotal
      };
    })
  );

  return { processedItems, totalItemsPrice };
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  const {
    items,
    address,
    shippingPrice = 0,
    taxPrice = 0,
    couponName,
    couponAmount = 0,
    paymentMethod,
    deliveryDate,
  } = req.body;

  try {
    // Validate request body
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required.",
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    // Generate unique order numbers
    const orderId = `ORD-${Date.now()}`;
    const orderNo = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate item totals
    const { processedItems, totalItemsPrice } = await calculateOrderTotals(items);

    // Final total price calculation
    const totalPrice =
      totalItemsPrice + shippingPrice + taxPrice - couponAmount;

    // Update product and variant stocks
    await Promise.all(
      processedItems.map(async (item) => {
        // Find and update product
        const product = await Product.findByIdAndUpdate(
          item.productId, 
          { $inc: { Qty: -item.quantity } },
          { new: true }
        );

        // Find and update product variant
        const variant = await ProductVariant.findByIdAndUpdate(
          item.variant,
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!product || !variant) {
          throw new Error(`Failed to update stock for product or variant`);
        }
      })
    );

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      orderNo,
      orderId,
      items: processedItems,
      address,
      shippingPrice,
      taxPrice,
      discountPrice: couponAmount,
      totalPrice,
      couponName: couponName || null,
      paymentMethod,
      deliveryDate: deliveryDate || null,
      orderStatus: "Order placed",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.productId items.variant", "name image");

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//TODO: NEED TO FIX THIS ORDER LIST BY USER
const OrderListByUser = async (req, res) => {
  try {
    const user_id = req.user?._id;

    // Fetch orders for the user
    const orderlist = await Order.find({ user_id });

    if (!orderlist || orderlist.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No orders found for the user",
      })
    }

    // Iterate over each order to calculate totalItems
    const ordersWithTotalItems = await Promise.all(orderlist.map(async (order) => {
      // Fetch cart items for each order
      const cartinfo = await Cart.find({ orderid: order.orderid });

      // Calculate totalItems for the order
      let totalItems = 0;
      cartinfo.forEach((cartItem) => {
        totalItems += cartItem.product_qty;
      });

      // Return order details along with totalItems
      return {
        order_id: order.orderid,
        user_name: order.user_name,
        order_date: order.order_date,
        order_status: order.order_status,
        grand_total_amount: order.grand_total_amount,
        totalItems: totalItems
      };
    }));

    res.status(200).json({ status: 1, orderlist: ordersWithTotalItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId items.variant", "name image");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

export { placeOrder, getOrders, OrderListByUser, getOrderById, updateOrderStatus };
