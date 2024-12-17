import Product from "../../models/Product/product.model.js";
import ProductVariant from "../../models/Product/productVariant.model.js";

export const searchItem = async (req, res) => {
  try {
    const { keyword } = req.query;
    const searchTerm = String(keyword).trim();

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    // Search in Product model
    const products = await Product.find({
      $or: [
        { productName: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } }, 
      ],
    });

    // Search in ProductVariant model
    const productVariants = await ProductVariant.find({
      $or: [
        { product_variant_name: { $regex: searchTerm, $options: "i" } },
        { variant_sku: { $regex: searchTerm, $options: "i" } },
      ],
    });

    // Combine and label results
    const combinedResults = [
      ...products.map((product) => ({
        type: "product",
        ...product._doc,
      })),
      ...productVariants.map((variant) => ({
        type: "variant",
        ...variant._doc,
      })),
    ];

    // Return results
    res.status(200).json({
      success: true,
      message: "Search results",
      data: combinedResults,
    });
  } catch (error) {
    console.error("Error in searchItem:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
