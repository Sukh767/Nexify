import mongoose from "mongoose";
import { uploadOnCloudinary } from "../../lib/cloudinary.js";
import Product from "../../models/Product/product.model.js";
import slugify from "slugify";
import Category from "../../models/Product/productCategory.model.js";
// Create a new product
//TODO: if something gone wrong delete the uploaded images from Cloudinary
const createProduct = async (req, res) => {
  const {
    productName,
    productUrl,
    brand,
    sizes,
    colors,
    parentCategory,
    child_category,
    short_description,
    description,
    meta_title,
    meta_description,
    meta_keywords,
    featuredProduct,
    isTrending,
    isNewArrival,
    tags,
    status,
    weight,
    weight_unit,
    dimensions,
    mrp_price,
    selling_price,
    discount,
    price_history,
    stock,
  } = req.body;

  try {
    // Validate required fields
    const requiredFields = [
      "productName",
      "productUrl",
      "parentCategory",
      "short_description",
      "description",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "mrp_price",
      "selling_price",
    ];
  
    const missingFields = requiredFields.filter((field) => !req.body[field]);
  
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}.`,
        missingFields,
      });
    }
  
    // Validate sizes array (if provided)
    if (sizes) {
      if (!Array.isArray(sizes)) {
        return res.status(400).json({
          success: false,
          message:
            "Sizes must be an array of objects with 'size' (string) and 'stock' (number).",
        });
      }
      const isValidSizes = sizes.every(
        (item) =>
          item.size &&
          typeof item.size === "string" &&
          typeof item.stock === "number"
      );
      if (!isValidSizes) {
        return res.status(400).json({
          success: false,
          message:
            "Each size must include 'size' (string) and 'stock' (number).",
        });
      }
    }
  
    // Validate colors array (if provided)
    if (colors) {
      if (!Array.isArray(colors)) {
        return res.status(400).json({
          success: false,
          message:
            "Colors must be an array of objects with 'colorName' (string) and optionally 'colorCode' (string).",
        });
      }
      const isValidColors = colors.every(
        (item) => item.colorName && typeof item.colorName === "string"
      );
      if (!isValidColors) {
        return res.status(400).json({
          success: false,
          message:
            "Each color must include 'colorName' (string). 'colorCode' is optional but must be a string if provided.",
        });
      }
    }
  
    // Handle image uploads
    if (!req.files || !req.files.images || req.files.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required.",
      });
    }
  
    const imageLocalPaths = req.files.images;
    const uploadedImages = [];
  
    // Upload images to Cloudinary
    for (const imagePath of imageLocalPaths) {
      const result = await uploadOnCloudinary(imagePath.path);
      if (result) {
        uploadedImages.push({
          public_id: result.public_id,
          url: result.secure_url || result.url,
        });
      } else {
        console.error("Failed to upload an image:", imagePath);
      }
    }
  
    if (uploadedImages.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload images to Cloudinary.",
      });
    }
  
    // Create a new product instance
    const product = await Product.create({
      productName,
      productUrl: slugify(productUrl),
      images: uploadedImages,
      brand,
      sizes,
      colors,
      parentCategory,
      child_category,
      short_description,
      description,
      meta_title,
      meta_description,
      meta_keywords,
      featuredProduct,
      isTrending,
      isNewArrival,
      tags,
      status,
      weight,
      weight_unit,
      dimensions,
      mrp_price,
      selling_price,
      discount,
      price_history,
      stock,
    });
  
    const productId = product._id;
  
    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
      Id: productId,
    });
  
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
  
};

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Fetch the product by ID
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      console.log("Product:", product);
  
      // Fetch parent and child categories
      const parentcategory = await fetchchildcategory(product.parentCategory);
      const childcategory = await fetchchildcategory(product.child_category);
  
      // Construct the response
      res.status(200).json({
        success: true,
        data: product,
        parentcategory,
        childcategory,
        slug: product.productUrl.replace(/-/g, " "),
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  
  // Fetch child categories based on category array
  const fetchchildcategory = async (categoryarray) => {
    if (!categoryarray || !Array.isArray(categoryarray) || categoryarray.length === 0) {
      return [];
    }
  
    try {
      // Handle single string or array of IDs
      const categoryIds = categoryarray.flatMap((item) =>
        typeof item === "string" ? item.split(",") : []
      );
  
      // Convert IDs to ObjectId
      const objectIdArray = categoryIds.map((id) => new mongoose.Types.ObjectId(id.trim()));
  
      // Query categories
      const categories = await Category.find({ _id: { $in: objectIdArray } });

      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

// Delete a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    //TODO: Delete images from Cloudinary

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    productUrl,
    brand,
    sizes,
    colors,
    parentCategory,
    short_description,
    description,
    meta_title,
    meta_description,
    meta_keywords,
    price_history,
    mrp_price,
    selling_price,
    stock,
    weight,
    weight_unit,
    dimensions,
    featuredProduct,
    isTrending,
    isNewArrival,
    tags,
    status,
    discount,
  } = req.body;

  console.log("Request Body:", req.body);

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    const data = {
      productName,
      productUrl,
      brand,
      sizes,
      colors,
      parentCategory,
      short_description,
      description,
      meta_title,
      meta_description,
      meta_keywords,
      price_history,
      mrp_price,
      selling_price,
      stock,
      weight,
      weight_unit,
      dimensions,
      featuredProduct,
      isTrending,
      isNewArrival,
      tags,
      status,
      discount,
    };

    if (sizes) {
      if (!Array.isArray(sizes)) sizes = JSON.parse(sizes);
      data.sizes = sizes;
    }

    if (colors) {
      if (!Array.isArray(colors)) colors = JSON.parse(colors);
      data.colors = colors;
    }

    //Object.assign(data, otherFields);

    console.log("Update Data:", data);

    if (req.files?.images?.length) {
      const uploadedImages = [];
      for (const file of req.files.images) {
        const result = await uploadOnCloudinary(file.path);
        if (result)
          uploadedImages.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
      }
      if (uploadedImages.length) data.images = uploadedImages;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!updatedProduct) {
      return res
        .status(400)
        .json({ success: false, message: "Product not updated." });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

//Get the searched products
const getSearchedProducts = async (req, res) => {
  const {name} = req.query; // Access `name` from query params
  console.log("Search Term:", name);

  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Search term is required.",
      });
    }

    const products = await Product.find({
      $or: [
        { productName: { $regex: name, $options: "i" } }, // Case-insensitive regex for productName
        { tags: { $regex: name, $options: "i" } },         // Case-insensitive regex for tags
        { meta_keywords: { $regex: name, $options: "i" } }, // Case-insensitive regex for meta_keywords
        { "colors.colorName": { $regex: name, $options: "i" } }, // Nested field for colorName
      ],
      status: "Active", // Ensure only active products are included
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error in getSearchedProducts:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//TODO: Implement the frontendProductListByCategory function
const frontendProductListByCategory = async (req, res) => {
  const { none, page, max_price, min_price, order,orderby,brand,size,color,weight } =
    req.query;

  //console.log("Query Params:", req.query);
  try {
    const categoryId = req.params.id;
    const itemsPerPage = 12;
    const pageNumber = parseInt(page) || 1;
    const skip = (pageNumber - 1) * itemsPerPage;
    let sortOptions = {};
    if (orderby) {
      if (orderby == "trendingproduct") {
        sortOptions[orderby] = 1;
      }
      if (orderby == "newarrivedproduct") {
        sortOptions[orderby] = 1;
      }

      if (orderby == "selling_price") {
        sortOptions[orderby] = order === "ASE" ? 1 : -1;
      }
    }else{
      sortOptions['selling_price'] = 1;
    }

    // Build the base query for finding products by category
    const baseQuery = {
      $or: [{ parentCategory: categoryId }, { child_category: categoryId }],
    };

    // Add price filtering to the base query
    if (min_price || max_price) {
      baseQuery.selling_price = {};
      if (min_price) baseQuery.selling_price.$gte = parseInt(min_price);
      if (max_price) baseQuery.selling_price.$lte = parseInt(max_price);
    }

if(weight){
  const [weightnum, weighttype] = weight.split(' ');
   baseQuery.weight = weightnum;
    baseQuery.weight_type = weighttype;
}
    if (color) baseQuery.color = color;
    if (size) baseQuery.size = size;
    if (brand) baseQuery.brand = brand;

    // Get total count before applying filters
    const totalCountBeforeFilter = await Product.countDocuments(baseQuery);
    console.log("Total Count Before Filter:", totalCountBeforeFilter);

    // Get products before applying filters
    const productsBeforeFilter = await Product
      .find(baseQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage);

      const totalItems = totalCountBeforeFilter;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      res.status(200).json({
        status: "success",
        data: productsBeforeFilter,
        totalPages,
        itemsPerPage,
        totalItems,
        pageNumber,
      });
    
  } catch (error) {
    console.log("Error in frontendProductListByCategory:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error.",
      error: error.message,
    });
  }
}


export {
  getAllProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updateProduct,
  getSearchedProducts,
  frontendProductListByCategory
};
