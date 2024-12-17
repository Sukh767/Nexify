import Cart from "../../models/cart.model.js";
import Wishlist from "../../models/wishlist.model.js"

const addToWishlist = async (req, res) => {
  const { product_name, item_or_variant, product_id, product_variant_id } = req.body;
  
  const user_id = req.user?.id; 

  try {
    // Validate required fields
    if (!product_name || !item_or_variant || !product_id || !product_variant_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "All fields (product_name, item_or_variant, product_id, product_variant_id, user_id) are required.",
      });
    }

    // Check if the item is already in the wishlist
    const existingWishlistItem = await Wishlist.findOne({
      product_id,
      product_variant_id,
      user_id,
    });

    if (existingWishlistItem) {
      return res.status(400).json({
        success: false,
        message: "Item is already in the wishlist.",
      });
    }

    // Create the wishlist entry
    const wishlist = await Wishlist.create({
      product_name,
      item_or_variant,
      product_id,
      product_variant_id,
      user_id,
    });

    res.status(201).json({
      success: true,
      message: "Item added to wishlist.",
      data: wishlist,
    });
  } catch (error) {
    console.error("Error during wishlist creation:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

const wishlist_list = async (req, res) => {
    try {
        // Get all wishlist items
        const wishlist = await Wishlist.find();
        if(!wishlist){
            return res.status(404).json({
                success: false,
                message: "Wishlist is empty",
            });
        }

        res.status(200).json({
            success: true,
            data: wishlist,
        });
    } catch (error) {
        console.log("Error during fetching wishlist items:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            details: error.message,
        });
    }
}

const itemwishlist = async (req, res) => {
    try {
      const userId = req.user?._id;
      const items = await Wishlist.find({ user_id: userId }).populate("user_id", "name email mobile").populate(
        "product_variant_id",
        "product_name product_image selling_price mrp_price product_id"
      ).populate("product_id", "product_name product_image selling_price mrp_price");

      if(!items){
        return res.status(404).json({
          success: false,
          message: "Wishlist is empty",
        });
      }

      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      console.log("Error during fetching wishlist items:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        details: error.message,
      });
    }
}

const addtocartlist = async (req, res) => {
    res.send('addtocartlist')
}

//Remove from wishlist
const removeWishlist = async (req, res) => {
    const { id } = req.params;
  
    try {
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Item id is required",
        });
      }
  
      const deletedItem = await Wishlist.findByIdAndDelete(id);
  
      if (!deletedItem) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }
  
      // Successfully removed the wishlist item
      res.status(200).json({
        success: true,
        message: "Item removed from wishlist",
        data: { id: deletedItem._id },
      });
    } catch (error) {
      console.error("Error during removing item from wishlist:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        details: error.message,
      });
    }
};

const wishlistCount = async (req, res) => {
    try {
      const userId = req.user?._id;

      const userWishlist = await Wishlist.find({ user_id: userId });

      if (!userWishlist) {
        return res.status(404).json({
          success: false,
          message: "Wishlist is empty",
        });
      }

      let count = 0;
      userWishlist.forEach((item) => {
        count += item.quantity;
      });

      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error) {
      console.log("Error during fetching wishlist items:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        details: error.message,
      });
    }
}

//TODO: need to modify( like variable name )
const addToCartDelete = async (req, res) => {
    try {
      const {cartId} = req.params

      const deletecartItem = await Cart.findByIdAndDelete(cartId) 
      if(!deletecartItem){
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: { id: deletecartItem._id },
      });

    } catch (error) {
      console.log("Error during fetching wishlist items:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        details: error.message,
      });
    }
}

export{
    addToWishlist,
    wishlist_list,
    itemwishlist,
    addtocartlist,
    wishlistCount,
    removeWishlist,
    addToCartDelete
}