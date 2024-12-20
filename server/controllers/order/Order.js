import { Order } from '../models/orderModel.js';
import Product from '../models/productModel.js';

// Helper function to calculate total price
const calculateOrderTotals = async (items) => {
  let totalPrice = 0;
  const processedItems = await Promise.all(items.map(async (item) => {
    // Fetch product to ensure current pricing
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product not found: ${item.product}`);
    }

    // Calculate item total
    const itemPrice = item.price || product.price;
    const itemDiscount = item.discount || 0;
    const itemTotal = (itemPrice - itemDiscount) * item.quantity;
    
    totalPrice += itemTotal;

    return {
      ...item,
      name: item.name || product.name,
      price: itemPrice,
      total: itemTotal
    };
  }));

  return { processedItems, totalPrice };
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { 
      user, 
      items, 
      address, 
      shippingPrice = 0, 
      taxPrice = 0,
      paymentMethod,
      couponName,
      couponAmount = 0
    } = req.body;

    // Calculate totals and process items
    const { processedItems, totalPrice } = await calculateOrderTotals(items);

    // Generate unique order ID and number
    const orderId = `ORD-${Date.now()}`;
    const orderNo = `#${Math.floor(10000 + Math.random() * 90000)}`;

    // Create new order
    const order = new Order({
      user,
      orderId,
      orderNo,
      items: processedItems,
      address,
      shippingPrice,
      taxPrice,
      totalPrice,
      couponName,
      couponAmount,
      paymentMethod
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating order', 
      error: error.message 
    });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching order', 
      error: error.message 
    });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user orders', 
      error: error.message 
    });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating payment status', 
      error: error.message 
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, deliveryDate } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    
    // Update delivery date if provided and status is delivered
    if (orderStatus === 'Delivered' && deliveryDate) {
      order.deliveryDate = deliveryDate;
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating order status', 
      error: error.message 
    });
  }
};

// @desc    Process order refund
// @route   PUT /api/orders/:id/refund
// @access  Private/Admin
export const processRefund = async (req, res) => {
  try {
    const { refundAmount } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate refund amount
    if (refundAmount > order.totalPrice) {
      return res.status(400).json({ 
        message: 'Refund amount cannot exceed total order price' 
      });
    }

    order.refund = {
      isRefunded: true,
      refundedAt: Date.now(),
      refundAmount: refundAmount
    };
    order.orderStatus = 'Returned';

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error processing refund', 
      error: error.message 
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate('user', 'id name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ 
      orders, 
      page, 
      pages: Math.ceil(count / pageSize) 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.deleteOne();

    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting order', 
      error: error.message 
    });
  }
};