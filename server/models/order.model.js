import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderNo: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductVariant",
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          required: false,
          default: 0.0, // Discount applied to this item
        },
        total: {
          type: Number,
          required: true,
          default: 0.0, // Calculated as quantity * (price - discount)
        },
      },
    ],
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: false },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, required: false },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    discountPrice: {
      type: Number,
      required: false,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    couponName: {
      type: String,
      default:null
    },
    couponAmount: {
      type: Number,
     default:0
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Cash", "Card", "Online", "UPI", "Wallet"],
      default: "Cash",
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    paymentResult: {
      id: { type: String }, 
      status: { type: String }, 
      update_time: { type: Date }, 
      email_address: { type: String },
    },
    /*stripeSessionId: {
			type: String,
			unique: true,
		},*/
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      enum: [
        "Order placed",
        "Order confirmed",
        "Packed",
        "Shipped",
        "Out for delivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Order placed",
      required: true,
    },
    deliveryDate: {
      type: Date,
    },
    returnable: {
      type: Boolean,
      required: true,
      default: true,
    },
    refund: {
      isRefunded: { type: Boolean, required: true, default: false },
      refundedAt: { type: Date },
      refundAmount: { type: Number, default: 0.0 },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);