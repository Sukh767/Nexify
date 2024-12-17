import Cart from "../../models/cart.model.js";
import { v4 as uuidv4 } from 'uuid';

const calculateFifteenPercent = (amount) => Math.round(amount * 0.15);

const getCartList = async (req, res) => {
  try {
    const user_id = req.user?._id;

    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Fetch user cart and populate relationships
    const userCart = await Cart.find({ user_id, orderstatus: "add to cart" })
      .populate("user_id", "first_name last_name email mobile")
      .populate(
        "product_variant_id",
        "product_name product_image description selling_price mrp_price weight weighttype"
      )
      .populate(
        "product_id",
        "product_name product_image description selling_price mrp_price weight weighttype"
      );

    //console.log("userCart:", userCart);

    if (userCart.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Initialize totals
    let total_Amount_with_discount = 0;
    let total_Amount_without_discount = 0;
    let totalItems = 0;
    let totalDiscount = 0;

    // Calculate totals
    userCart.forEach((cartItem) => {
      const productData =
        cartItem.product_variant_id || cartItem.product_id; // Fallback logic
      const { selling_price, mrp_price } = productData;

      total_Amount_with_discount += cartItem.product_qty * selling_price;
      total_Amount_without_discount += cartItem.product_qty * mrp_price;

      const discount = mrp_price - selling_price;
      totalDiscount += discount * cartItem.product_qty;

      totalItems += cartItem.product_qty;
    });

    const shipping_charges = calculateFifteenPercent(total_Amount_with_discount);

    res.status(200).send({
      success: true,
      message: "Cart fetched successfully",
      data: userCart,
      total_Amount_with_discount_subtotal: total_Amount_with_discount,
      total_Amount_with_discount: total_Amount_with_discount + shipping_charges,
      total_Amount_without_discount,
      totalItems,
      totalDiscount,
      shipping_charges,
    });
  } catch (error) {
    console.error("Error in getCartList:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const addToCart = async (req, res) => {
    const {
      product_name,
      item_or_variant,
      product_id,
      product_variant_id,
      product_qty,
    } = req.body;
  
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }
  
      // Check if the product already exists in the cart
      const existingCartItem = await Cart.findOne({
        product_id,
        product_variant_id,
        user_id: userId,
      });
  
      //console.log("existingCartItem:", existingCartItem);
  
      if (existingCartItem) {
        // If product exists, update the quantity
        existingCartItem.product_qty += product_qty;
        await existingCartItem.save();
  
        return res.status(200).json({
          success: true,
          message: "Product quantity updated in the cart",
          data: existingCartItem,
        });
      } else {
        // Create a new cart item
        const newCartItem = new Cart({
          product_name,
          item_or_variant,
          product_id,
          product_variant_id,
          product_qty,
          user_id: userId,
          orderid: uuidv4(),
          orderstatus: "add to cart",
        });
  
        const savedCartItem = await newCartItem.save();
  
        return res.status(201).json({
          success: true,
          message: "Product added to the cart successfully",
          data: savedCartItem,
        });
      }
    } catch (error) {
      console.error("Error in addToCart:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
};

const deleteFromCart = async (req, res) => {
  const { product_id } = req.params;
    const userId = req.user?._id;

    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const cartItem = await Cart.findOneAndDelete({ _id: product_id, user_id: userId });

        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in the cart" });
        }

        res.status(200).json({ success: true, message: "Product removed from the cart successfully" });
    } catch (error) {
        console.log("Error in removeFromCart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const updateCartQty = async (req, res) => {
  const { product_id, product_qty } = req.body;

  const userId = req.user?._id;

  try {
    if(!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const cartItem = await Cart.findOne({ product_id, user_id: userId });

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    cartItem.product_qty = product_qty;
    await cartItem.save();

    res.status(200).json({ success: true, message: "Cart updated successfully", data: cartItem });
  } catch (error) {
    console.log("Error in updateCart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const clearCart = async (req, res) => {
    const userId = req.user?._id;
    
    try {
        
        if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
        }
    
        await Cart.deleteMany({ user_id: userId });
    
        res.status(200).json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.log("Error in clearCart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const cartCount = async (req, res) => {
  const userId = req.user?._id;

   try {
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const cartCount = await Cart.find({ user_id: userId, orderstatus: "add to cart" })

    let totalItems = 0;
    cartCount.forEach((cartCount) => {
      totalItems += cartCount.product_qty;
    });

    res.status(200).json({ success: true, message: "Cart count fetched successfully", data: cartCount, count: totalItems });

   } catch (error) {
        console.log("Error in cartCount:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
   }
};

const removeSingleFromCart = async (req, res) => {
    const {product_id} = req.params;

    const userId = req.user?._id;

    try {
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const cartItem = await Cart.findOne({ _id: product_id, user_id: userId });

        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in the cart" });
        }

        cartItem.product_qty -= 1;

        if (cartItem.product_qty === 0) {
            await cartItem.deleteOne();
            return res.status(200).json({ success: true, message: "Product removed from the cart successfully" });
        }

        await cartItem.save();

        res.status(200).json({ success: true, message: "Product quantity updated in the cart", data: cartItem });

    } catch (error) {
        console.log("Error in removeSingleFromCart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}

export {
  getCartList,
  addToCart,
  deleteFromCart,
  removeSingleFromCart,
  updateCartQty,
  clearCart,
  cartCount,
};
