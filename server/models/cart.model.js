import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    item_or_variant: {
      type: String,
      required: true,
      default: "item",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    product_variant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      default: null,
    },
    product_qty: {
      type: Number,
      default: 1,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderstatus: {
      type: String,
      default: "add to cart",
    },
    orderid: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;