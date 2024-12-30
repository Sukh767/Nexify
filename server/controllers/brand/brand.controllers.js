import Brand from "../../models/brand.model.js";
import { uploadOnCloudinary } from "../../lib/cloudinary.js";
import Product from "../../models/Product/product.model.js";


// Create a new Brand
const createBrand = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const UpdateCreatedBy = req.user._id;

    if (!req.files?.logo || req.files.logo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Brand logo is required.",
      });
    }

    // Upload logo to Cloudinary
    const localImagePath = req.files.logo[0].path;

    if(!localImagePath){
        return res.status(400).json({
            status: "failed",
            success: false,
            error: {
              banner: { message: "Brand logo is required", path: "logo" },
            },
        });
    }

    let logo;

    try {
        let logoUpload = await uploadOnCloudinary(localImagePath, "brand");
        logo = {
            public_id: logoUpload.public_id,
            url: logoUpload.secure_url
        }
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            success: false,
            error: {
              banner: { message: "Failed to upload logo to Cloudinary", path: "logo" },
        },
    }); 
    }

    const newBrand = new Brand({
      name,
      description,
      status,
      createdBy: UpdateCreatedBy,
      logo: [logo]
    });

    const savedBrand = await newBrand.save();

    res.status(201).json({
      success: true,
      message: "Brand created successfully.",
      data: savedBrand,
    });
  } catch (error) {
    console.error("Error creating brand:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create brand.",
      error: error.message,
    });
  }
};

// Update Brand
const updateBrand = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, status } = req.body;
  
      const existingBrand = await Brand.findById(id);
      if (!existingBrand) {
        return res.status(404).json({
          success: false,
          message: "Brand not found.",
        });
      }
  
      // Handle logo updates if provided
      let updatedLogo = [...existingBrand.logo]; // Retain existing logos
  
      if (req.files?.logo && req.files.logo.length > 0) {
        for (const file of req.files.logo) {
          try {
            const uploadResponse = await uploadOnCloudinary(file.path, {
              folder: "brands", // Specify folder in Cloudinary for organized storage
            });
  
            updatedLogo.push({
              public_id: uploadResponse.public_id,
              url: uploadResponse.secure_url || uploadResponse.url,
            });
          } catch (uploadError) {
            console.error("Error uploading logo to Cloudinary:", uploadError);
            return res.status(500).json({
              success: false,
              message: "Failed to upload logo.",
              error: uploadError.message,
            });
          }
        }
      }
  
      // Update brand fields
      const updatedBrand = await Brand.findByIdAndUpdate(
        id,
        {
          name: name || existingBrand.name,
          description: description || existingBrand.description,
          status: status !== undefined ? status : existingBrand.status,
          logo: updatedLogo,
        },
        { new: true, runValidators: true }
      );
  
      res.status(200).json({
        success: true,
        status: "successfull",
        message: "Brand updated successfully.",
        data: updatedBrand,
      });
    } catch (error) {
      console.error("Error updating brand:", error);
      res.status(500).json({
        success: false,
        status: "failed",
        message: "Failed to update brand.",
        error: error.message,
      });
    }
};
  
// Get All Brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    if (!brands.length) {
      return res.status(404).json({
        success: false,
        message: "No brands found.",
      });
    }

    res.status(200).json({
      success: true,
      status: "successfull",
      message: "Brands fetched successfully.",
      data: brands,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({
      success: false,
      status: "failed",
      message: "Failed to fetch brands.",
      error: error.message,
    });
  }
};

// Get Products by Brand
const getProductsByBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id).populate("products");
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Products for brand ${brand.name} fetched successfully.`,
      data: brand.products,
    });
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products by brand.",
      error: error.message,
    });
  }
};

//Delete Brand
const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
    
        const brand = await Brand.findById(id);
        if (!brand) {
        return res.status(404).json({
            status: "failed",
            success: false,
            message: "Brand not found.",
        });
        }

        //Delete images from cloudinary
        try {
          for (const image of brand.logo) {
            const res = await deleteFromCloudinary(image.public_id);
            console.log("Deleted image from cloudinary:", res);
          }  
        } catch (error) {
          console.log("Error deleting images from cloudinary:", error);
          return res.status(500).json({
            success: false,
            message: "Failed to delete brand images.",
            error: error.message,
          });
        }

        //TODO: Delete products associated with brand
    
        // Delete brand
        const deletedBrand = await Brand.findByIdAndDelete(id);
        console.log("Deleted brand:", deletedBrand);
    
        res.status(200).json({
        status: "successfull",
        success: true,
        message: "Brand deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting brand:", error);
        res.status(500).json({
        success: false,
        message: "Failed to delete brand.",
        error: error.message,
        });
    }
}

// Get Brand by ID
const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
    
        const brand = await Brand.findById(id);
        if (!brand) {
        return res.status(404).json({
            success: false,
            message: "Brand not found.",
        });
        }
    
        res.status(200).json({
        success: true,
        message: "Brand fetched successfully.",
        data: brand,
        });
    } catch (error) {
        console.error("Error fetching brand:", error);
        res.status(500).json({
        success: false,
        message: "Failed to fetch brand.",
        error: error.message,
        });
    }
}

export {
    createBrand,
    updateBrand,
    getAllBrands,
    getProductsByBrand,
    deleteBrand,
    getBrandById
}