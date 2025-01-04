import mongoose from "mongoose";
import { deleteFromCloudinary, uploadOnCloudinary } from "../../lib/cloudinary.js";
import ProductVariant from "../../models/Product/productVariant.model.js";

const createVariantProduct = async (req, res) => {
  const {
    product_name,
    product_url,
    product_id,
    brand,
    size,
    colors,
    parentCategory,
    child_category,
    sort_description,
    description,
    meta_title,
    meta_description,
    meta_keywords,
    skucode,
    status,
    newarrivedproduct,
    trendingproduct,
    featuredproduct,
    weight,
    weight_type,
    mrp_price,
    selling_price,
    stock,
  } = req.body;

  console.log(req.body);

  try {
    // Handle file upload
    const product_image = req.files?.banner?.[0]?.path;
    if (!product_image) {
      return res.status(400).json({
        status: "failed",
        error: {
          banner: { message: "Product image is required", path: "banner" },
        },
      });
    }

    // Upload image to Cloudinary
    let banner;
    try {
      const uploadResponse = await uploadOnCloudinary(product_image);
      banner = {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url || uploadResponse.url,
      };
      console.log("uploadResponse : product Variant", uploadResponse);
    } catch (uploadError) {
      return res.status(500).json({
        status: "failed",
        error: {
          message: "Failed to upload banner to Cloudinary",
          details: uploadError.message,
        },
      });
    }

    // Create new product variant
    const insertVariantProduct = new ProductVariant({
      product_name,
      product_url,
      product_image: banner, // Save the uploaded banner details
      product_id,
      brand,
      size,
      colors,
      parentCategory,
      child_category,
      sort_description,
      description,
      meta_title,
      meta_description,
      meta_keywords,
      skucode,
      status,
      newarrivedproduct,
      trendingproduct,
      featuredproduct,
      weight,
      weight_type,
      mrp_price,
      selling_price,
      stock,
    });

    // Save the product variant
    const savedProduct = await insertVariantProduct.save();

    // Success response
    res.status(201).json({
      status: "successful",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error in createVariantProduct:", error);
    res.status(500).json({
      status: "failed",
      error: {
        message: "Internal server error",
        details: error.message,
      },
    });
  }
};

const getAllVariantProduct = async (req, res) => {
  try {
    const variants = await ProductVariant.find();
    res.status(200).json({
      status: "successful",
      data: variants,
    });
  } catch (error) {
    console.error("Error in getVariantProduct:", error);
    res.status(500).json({
      status: "failed",
      error: {
        message: "Internal server error",
        details: error.message,
      },
    });
  }
};

const updateVariantProductById = async (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    product_url,
    product_id,
    brand,
    size,
    colors,
    parentCategory,
    child_category,
    sort_description,
    description,
    meta_title,
    meta_description,
    meta_keywords,
    skucode,
    status,
    newarrivedproduct,
    trendingproduct,
    featuredproduct,
    weight,
    weight_type,
    mrp_price,
    selling_price,
    stock,
  } = req.body;

  try {
    // Find the existing product variant
    const variant = await ProductVariant.findById(id);

    if (!variant) {
      return res.status(404).json({
        status: "failed",
        error: {
          message: "Product variant not found",
        },
      });
    }

    //console.log("Existing Variant:", variant);

    // Initialize banner with existing images
    let banner = [...variant.product_image]; // Keep existing images

    // Handle new images upload
    if (req.files?.banner) {
      for (const file of req.files.banner) {
        try {
          const uploadResponse = await uploadOnCloudinary(file.path, {
            folder: "product_variants",
          });

          banner.push({
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url || uploadResponse.url,
          });
        } catch (uploadError) {
          console.error("Error uploading image to Cloudinary:", uploadError);
          return res.status(500).json({
            status: "failed",
            error: {
              message: "Failed to upload one or more images to Cloudinary",
              details: uploadError.message,
            },
          });
        }
      }
    }

    // Update fields
    variant.product_name = product_name || variant.product_name;
    variant.product_url = product_url || variant.product_url;
    variant.product_image = banner; // Update with combined images
    variant.product_id = product_id || variant.product_id;
    variant.brand = brand || variant.brand;
    variant.size = size || variant.size;
    variant.colors = colors || variant.colors;
    variant.parentCategory = parentCategory || variant.parentCategory;
    variant.child_category = child_category || variant.child_category;
    variant.sort_description = sort_description || variant.sort_description;
    variant.description = description || variant.description;
    variant.meta_title = meta_title || variant.meta_title;
    variant.meta_description = meta_description || variant.meta_description;
    variant.meta_keywords = meta_keywords || variant.meta_keywords;
    variant.skucode = skucode || variant.skucode;
    variant.status = status || variant.status;

    // Convert boolean fields from strings
    variant.newarrivedproduct =
      newarrivedproduct === "true" ? true : newarrivedproduct === "false" ? false : variant.newarrivedproduct;
    variant.trendingproduct =
      trendingproduct === "true" ? true : trendingproduct === "false" ? false : variant.trendingproduct;
    variant.featuredproduct =
      featuredproduct === "true" ? true : featuredproduct === "false" ? false : variant.featuredproduct;

    variant.weight = weight || variant.weight;
    variant.weight_type = weight_type || variant.weight_type;
    variant.mrp_price = mrp_price || variant.mrp_price;
    variant.selling_price = selling_price || variant.selling_price;
    variant.stock = stock || variant.stock;

    // Save updated product variant
    const updatedProduct = await variant.save();

    res.status(200).json({
      status: "successful",
      message: "Product variant updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error in updateVariantProductById:", error);
    res.status(500).json({
      status: "failed",
      error: {
        message: "Internal server error",
        details: error.message,
      },
    });
  }
};

//delete variant product by id
const deleteVariantProductById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        status: "failed",
        error: { message: "Product variant ID is required" },
      });
    }

    const variant = await ProductVariant.findById(id);

    if (!variant) {
      return res.status(404).json({
        status: "failed",
        error: { message: "Product variant not found" },
      });
    }

    const publicId = variant.product_image[0]?.public_id;
    if (!publicId) {
      return res.status(400).json({
        status: "failed",
        error: { message: "No public_id found for the product image" },
      });
    }

    // Delete image from Cloudinary
    const cloudinaryResponse = await deleteFromCloudinary(publicId);
    //console.log("deleteFromCloudinary", cloudinaryResponse);

    // Delete product variant from database
    await variant.deleteOne();

    res.status(200).json({
      status: "successful",
      message: "Product variant deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteVariantProductById:", error);
    res.status(500).json({
      status: "failed",
      error: { message: "Internal server error", details: error.message },
    });
  }
};

//Get variant product by id
const getVariantProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const variant = await ProductVariant.findById(id);

    if (!variant) {
      return res.status(404).json({
        status: "failed",
        error: {
          message: "Product variant not found",
        },
      });
    }

    let parentcategory = await fetchchildcategory(variant.parentCategory);
    let childcategory = await fetchchildcategory(variant.child_category);

    res.status(200).json({
      status: "successful",
      data: variant,
      parentcategory,
      childcategory,
      slug:variant.product_url.replace(/-/g, ' ')
    });
  } catch (error) {
    console.log("Error in getVariantProductById:", error);
    res.status(500).json({
      status: "failed",
      error: {
        message: "Internal server error",
        details: error.message,
      },
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
      const categories = await category.find({ _id: { $in: objectIdArray } });
      return categories;
    } catch (error) {}
  } else {
    return [];
  }
};

export {
  createVariantProduct,
  getAllVariantProduct,
  updateVariantProductById,
  deleteVariantProductById,
  getVariantProductById,
};
