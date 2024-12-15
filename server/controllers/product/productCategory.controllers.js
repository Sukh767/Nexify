import mongoose from "mongoose";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../lib/cloudinary.js";
import Category from "../../models/Product/productCategory.model.js";
import slugify from "slugify";

const createCategory = async (req, res) => {
  try {
    const {
      category_name,
      category_url,
      editor,
      meta_description,
      meta_title,
      meta_keywords,
      parent_category,
      status,
    } = req.body;

    // Validate required fields
    if (!category_name || !category_url) {
      return res.status(400).json({
        status: "failed",
        error: "Category name and URL are required",
      });
    }

    // Check for duplicate category name and URL
    const isNameAvailable = await checkIfCategoryExists("name", category_name);
    if (!isNameAvailable) {
      return res.status(409).json({
        status: "failed",
        error: {
          name: {
            message: "Category with this name already exists",
            path: "name",
          },
        },
      });
    }
    const isUrlAvailable = await checkIfCategoryExists("url", category_url);
    if (!isUrlAvailable) {
      return res.status(409).json({
        status: "failed",
        error: {
          url: {
            message: "Category with this URL already exists",
            path: "url",
          },
        },
      });
    }

    // Handle file upload
    const bannerLocalPath = req.files?.banner?.[0]?.path;
    if (!bannerLocalPath) {
      return res.status(400).json({
        status: "failed",
        error: {
          banner: { message: "Category image is required", path: "banner" },
        },
      });
    }

    let banner;
    try {
      const uploadResponse = await uploadOnCloudinary(bannerLocalPath);
      banner = {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url || uploadResponse.url,
      };
    } catch (uploadError) {
      return res.status(500).json({
        status: "failed",
        error: {
          message: "Failed to upload banner to Cloudinary",
          details: uploadError.message,
        },
      });
    }

    // Create new category
    const newCategory = new Category({
      name: category_name,
      url: slugify(category_url, { lower: true }),
      description: editor,
      metaTitle: meta_title,
      metaDescription: meta_description,
      status,
      metaKeywords: meta_keywords,
      parentCategory: parent_category ? parent_category : [],
      banner: [banner], // Wrap in an array
    });

    // Save category to DB
    const savedCategory = await newCategory.save();
    res.status(201).json({ status: "successful", data: savedCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(error.statusCode || 500).json({
      status: "failed",
      error: error.message || "Internal Server Error",
    });
  }
};

//Category lsit
const getCategoryList = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({ status: "successful", data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(error.statusCode || 500).json({
      status: "failed",
      error: error.message || "Internal Server Error",
    });
  }
};

//get empty parent category list
const getEmptyParentCategoryList = async (req, res) => {
  try {
    const categories = await Category.find({ parentCategory: [] }).sort({
      createdAt: -1,
    });

    res.status(200).json({ status: "successful", data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(error.statusCode || 500).json({
      status: "failed",
      error: error.message || "Internal Server Error",
    });
  }
};

// Function to check if a category exists
async function checkIfCategoryExists(key, value) {
  const filter = key === "name" ? { name: value } : { url: value };
  const exists = await Category.exists(filter);
  return !exists; // Return true if not exists, false if exists
}

// get category by id
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ status: "failed", error: "Category not found" });
    }

    // Fetch child categories directly using parentCategory field
    const childCategories = await fetchChildCategory(category.parentCategory);

    res.status(200).json({
      status: "successful",
      data: category,
      parent: childCategories,
      slug: category.url.replace(/-/g, " "),
    });
  } catch (error) {
    console.log("Error fetching category by ID:", error);
    res.status(error.statusCode || 500).json({
      status: "failed",
      error: error.message || "Internal Server Error",
    });
  }
};

const fetchChildCategory = async (categoryarray) => {
  if (categoryarray[0]) {
    try {
      const categoryIds = categoryarray[0].split(",");
      const objectIdArray = categoryIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const categories = await Category.find({ _id: { $in: objectIdArray } });
      return categories;
    } catch (error) {}
  } else {
    return [];
  }
};

// delete category by id
//TODO: delete image from cloudinary with delete category
const deleteCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ status: "failed", error: "Category not found" });
    }

    // Delete the banner from Cloudinary if it exists
    if (category.banner?.public_id) {
      console.log(
        "Deleting banner from Cloudinary:",
        category.banner.public_id
      );
      await deleteFromCloudinary(category.banner.public_id);
    }

    // Delete the category
    await Category.findByIdAndDelete(id);
    res
      .status(200)
      .json({ status: "successful", message: "Category deleted successfully" });
  } catch (error) {
    console.log("Error deleting category by ID:", error);
    res.status(error.statusCode || 500).json({
      status: "failed",
      error: error.message || "Internal Server Error",
    });
  }
};

//update category by id
//TODO: fix update category by id and delete image from cloudinary if new image is uploaded if not then keep the old image
const updateCategoryById = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    metaTitle,
    metaDescription,
    metaKeywords,
    status,
  } = req.body;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ status: "failed", error: "Category not found" });
    }

    console.log("Current Banner:", category.banner);

    let updatedBanner = category.banner; // Default to the current banner

    // Check if a new banner is uploaded
    if (req.files?.banner) {
      const file = req.files.banner[0]; // Get the uploaded file

      // Delete the old banner from Cloudinary if it exists
      if (category.banner?.public_id) {
        await uploadOnCloudinary.uploader.destroy(category.banner.public_id);
      }

      // Upload the new banner to Cloudinary
      const uploadResult = await uploadOnCloudinary(file.path, {
        folder: "categories", // Organize images in Cloudinary
      });

      updatedBanner = {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      };

      console.log("New Banner:", updatedBanner);
    }

    // Update category fields
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name || category.name,
        description: description || category.description,
        metaTitle: metaTitle || category.metaTitle,
        metaDescription: metaDescription || category.metaDescription,
        metaKeywords: metaKeywords || category.metaKeywords,
        status: status || category.status,
        banner: updatedBanner, // Only update if changed
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({ status: "successful", data: updatedCategory });
  } catch (error) {
    console.error("Error updating category by ID:", error);
    res.status(error.statusCode || 500).json({
      status: "failed",
      error: error.message || "Internal Server Error",
    });
  }
};

// Vertical category list Electronic, Fashion, Home, etc
const getAllFrontendCategoryList = async (req, res) => {
  try {
    // Fetch all active categories
    const categories = await Category.find({ status: " Active" });
    //console.log("categories", categories);

    if (!categories.length) {
      return res.status(200).json({ status: "successful", data: [] });
    }

    // Organize categories
    const mainCategories = [];
    const categoriesMap = new Map();

    // Populate categoriesMap with all categories
    categories.forEach((cat) => {
      categoriesMap.set(cat._id.toString(), {
        ...cat._doc,
        subcategories: [],
      });
    });

    // Iterate through categories and link them
    categories.forEach((cat) => {
      if (cat.parentCategory.length === 0) {
        // Add to main categories if no parent
        mainCategories.push(categoriesMap.get(cat._id.toString()));
      } else {
        // Link to parent category if parent exists
        const parentCategory = categoriesMap.get(
          cat.parentCategory[0].toString()
        );
        if (parentCategory) {
          parentCategory.subcategories.push(categoriesMap.get(cat._id.toString()));
        }
      }
    });

    // Respond with the organized main categories
    res.status(200).json({ status: "successful", data: mainCategories });
  } catch (error) {
    console.error("Error fetching all frontend categories:", error);
    res.status(error.statusCode || 500).json({
      status: "failed",
      error: error.message || "Internal Server Error",
    });
  }
};


export {
  createCategory,
  getCategoryList,
  getEmptyParentCategoryList,
  getCategoryById,
  deleteCategoryById,
  updateCategoryById,
  getAllFrontendCategoryList,
};
