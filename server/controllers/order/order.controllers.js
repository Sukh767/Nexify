import { Order } from "../../models/order.model.js";
import Product from "../../models/Product/product.model.js";


const placeOrder = async (req, res) => {
  const {
    items,
    address,
    shippingPrice,
    taxPrice,
    totalPrice,
    couponName,
    couponAmount,
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

    // Generate a unique order number
    const orderNo = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate total from items (server-side validation)
    let calculatedTotal = 0;
    for (const item of items) {
      const itemTotal = item.quantity * (item.price - (item.discount || 0));
      calculatedTotal += itemTotal;
    }
    calculatedTotal += shippingPrice + taxPrice - (couponAmount || 0);

    if (totalPrice !== calculatedTotal) {
      return res.status(400).json({
        success: false,
        message: "Total price mismatch. Please verify your order details.",
      });
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id, // Assuming `req.user` is populated via authentication middleware
      orderNo,
      items,
      address,
      shippingPrice,
      taxPrice,
      discountPrice: couponAmount || 0,
      totalPrice,
      couponName: couponName || null,
      couponAmount: couponAmount || 0,
      paymentMethod,
      deliveryDate: deliveryDate || null,
      orderStatus: "Order placed",
    });

    // Decrease stock quantity for each product
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = product.stock - item.quantity;
        await product.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export {
    placeOrder
}

/*
{
  "items": [
    {
      "product": "64f2b02e4edbc72e145a67e5",
      "variant": "64f2b02e4edbc72e145a67e6",
      "name": "Red T-shirt",
      "quantity": 2,
      "price": 500,
      "discount": 50
    },
    {
      "product": "64f2b02e4edbc72e145a67e7",
      "name": "Blue Jeans",
      "quantity": 1,
      "price": 1000,
      "discount": 100
    }
  ],
  "address": {
    "fullName": "John Doe",
    "phone": "1234567890",
    "email": "johndoe@example.com",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "shippingPrice": 50,
  "taxPrice": 150,
  "totalPrice": 2000,
  "couponName": "SAVE20",
  "couponAmount": 200,
  "paymentMethod": "Online",
  "deliveryDate": "2024-12-20T10:00:00Z"
}
*/