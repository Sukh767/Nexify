import mongoose from "mongoose";
import Product from "../../models/Product/product.model.js";
import Category from "../../models/Product/productCategory.model.js";
import ProductVariant from "../../models/Product/productVariant.model.js";
import Wishlist from "../../models/wishlist.model.js";


const frontendSingleProduct = async (req, res) => {

  const { id } = req.params;
  
  try {
    const data = await Product.findById(id);
    
    if(!data){
        return res.status(404).send({ error: "Product not found" });
    }

    const user_id = req.user._id || 0;

    let wishlist_status = false;

    if (user_id) {
      const productWishlistEntry = await Wishlist.findOne({
        user_id,
        product_id: id,
      });
      wishlist_status = productWishlistEntry ? true : false;
    }

    let parentcategory = await fetchchildcategory(data.parentCategory);
    let childcategory = await fetchchildcategory(data.child_category);
    const productvariant = await ProductVariant.find({ product_id: id });
    const variantIds = productvariant.map((v) => v._id);
    const variantWishlistEntries = await Wishlist.find(user_id == 0 ? {
      product_variant_id: { $in: [] },
    } : {
      user_id,
      product_variant_id: { $in: variantIds },
    });
    const variantWishlistMap = new Map(variantWishlistEntries.map((entry) => [entry.product_variant_id.toString(), true]));
    let combinedDynamicAttributes = [];
    const variantsWithWishlistStatus = productvariant.map((variant) => {
      const dynamicAttributesVariant = variant.dynamicAttributes || [];
      combinedDynamicAttributes = [...data.dynamicAttributes, ...dynamicAttributesVariant];
      const variantWishlistStatus = variantWishlistMap.has(variant._id.toString());
      return {
        ...variant._doc,
        dynamicAttributes: combinedDynamicAttributes,
        wishlist_status: variantWishlistStatus,
      };
    });

    // Filter out duplicate attributes based on their keys
    const uniqueAttributes = Array.from(
      new Map(combinedDynamicAttributes.map((attr) => [JSON.stringify(attr), attr])).values()
    );

    res.send({
      status: "successfully",
      data: { ...data._doc, wishlist_status },
      parentcategory,
      childcategory,
      productvariant: variantsWithWishlistStatus,
      uniqueAttributes,
      slug: data.productUrl.replace(/-/g, " "),
    });
  } catch (error) {
    console.error('An error occurred while fetching data: ',error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
     });
  }
};

const fetchchildcategory = async (categoryarray) => {
  if (categoryarray[0]) {
    try {
      const categoryIds = categoryarray[0].split(",");
      const objectIdArray = categoryIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const categories = await Category.find({ _id: { $in: objectIdArray } });
      return categories;
    } catch (error) {
      console.log("Error during fetching child category - frontendSingleProduct:", error);
      throw error;
    }
  } else {
    return [];
  }
};

export default frontendSingleProduct;