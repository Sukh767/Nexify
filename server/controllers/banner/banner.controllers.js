import { deleteFromCloudinary, uploadOnCloudinary } from '../../lib/cloudinary.js';
import Banner from '../../models/banner.model.js';


const createBanner = async (req, res) => {
    try {
        const { bannerName, bannerAlt, bannerType, description,status } = req.body;

        //Check other required fields
        if (!bannerName || !bannerAlt || !bannerType || !description || !status) {
            return res.status(400).json({
              success: false,
              message: "All fields are required.",
            });
        }

        if (!req.files || !req.files.bannerImages || req.files.bannerImages.length === 0) {
            return res.status(400).json({
              success: false,
              message: "At least one image is required.",
            });
        }

        const imageLocalPaths = req.files.bannerImages
        const uploadedImages = []

        for (const image of imageLocalPaths) {
            const result = await uploadOnCloudinary(image.path, "banner");
            if(result){
                uploadedImages.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            }
        }

        if (uploadedImages.length === 0) {
            return res.status(500).json({
              success: false,
              message: "Failed to upload images to Cloudinary.",
            });
        }

        //Convert status string to boolean
        let updateStatus = status === "Active" ? true : false;
    
        const newBanner = await Banner.create({
            bannerName,
            bannerAlt,
            bannerImages: uploadedImages,
            bannerType,
            description,
            status: updateStatus,
        });
    
        res.status(201).json({
        success: true,
        status: "successful",
        message: "Banner created successfully",
        data: newBanner,
        });

    } catch (error) {
        console.error("Error in createBanner:", error);
        res.status(500).json({
        status: "failed",
        error: {
            message: "Internal server error",
            details: error.message,
        },
    });
    }
}

const getAllBannersDetails = async (req, res) => {
    try {
        const banners = await Banner.find();
        if (!banners) {
            return res.status(404).json({
                success: false,
                message: "Banners not found",
            });
        }
        res.status(200).json({
          success: true,
          status: "successful",
          message: "Banners fetched successfully",
          data: banners,
        });
    } catch (error) {
        console.error("Error in getBanners:", error);
        res.status(500).json({
          status: "failed",
          error: {
            message: "Internal server error",
            details: error.message,
          },
        });
    }
}

const getBannerById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Banner ID is required",
            });
        }

        const banner = await Banner.findById(id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        res.status(200).json({
            success: true,
            status: "successful",
            message: "Banner fetched successfully",
            data: banner,
        })
    } catch (error) {
        console.log("Error in getBannerById:", error);
        res.status(500).json({
            success: false,
            status: "failed",
            error: {
                message: "Internal server error",
                details: error.message,
            },
        });
    }
}

const updateBanner = async (req, res) => {
    try {
      const { id } = req.params;
      const { bannerName, bannerAlt, bannerType, description, status } = req.body;

      console.log("req.body:", req.body);
  
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Banner ID is required.",
        });
      }
  
      const existingBanner = await Banner.findById(id);
      if (!existingBanner) {
        return res.status(404).json({
          success: false,
          message: "Banner not found.",
        });
      }
  
      // Handle new image uploads
      let updatedImages = [...existingBanner.bannerImages];
  
      if (req.files?.bannerImages) {
        for (const file of req.files.bannerImages) {
          const uploadResponse = await uploadOnCloudinary(file.path, {
            folder: "banners",
          });
          updatedImages.push({
            public_id: uploadResponse.public_id,
            url: uploadResponse.secure_url || uploadResponse.url,
          });
        }
      }

      let updateStatus = status === "Active" ? true : status === "Inactive" ? false : existingBanner.status;
      console.log("updateStatus:", updateStatus);
  
      // Update the banner document
      const updatedBanner = await Banner.findByIdAndUpdate(
        id,
        {
          bannerName: bannerName || existingBanner.bannerName,
          bannerAlt: bannerAlt || existingBanner.bannerAlt,
          bannerType: bannerType || existingBanner.bannerType,
          description: description || existingBanner.description,
          status: updateStatus,
          bannerImages: updatedImages,
        },
        { new: true, runValidators: true }
      );
  
      res.status(200).json({
        success: true,
        status: "successful",
        message: "Banner updated successfully.",
        data: updatedBanner,
      });
    } catch (error) {
      console.error("Error in updateBanner:", error);
      res.status(500).json({
        success: false,
        status: "failed",
        error: {
          message: "Internal server error.",
          details: error.message,
        },
      });
    }
};
  
const deleteBannerById = async (req, res) => {
    try {
      const { id } = req.params;
  
    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Banner ID is required.",
        });
    }  
  
      const banner = await Banner.findById(id);
      if (!banner) {
        return res.status(404).json({
          success: false,
          message: "Banner not found",
        });
      }
  
      // Delete Cloudinary image if it exists
        if (banner.bannerImages && banner.bannerImages.length > 0) {
            for (const image of banner.bannerImages) {
            const res = await deleteFromCloudinary(image.public_id);
            console.log("Cloudinary delete response:", res);
            }
        }
  
      await Banner.findByIdAndDelete(id);
  
      res.status(200).json({
        success: true,
        status: "successful",
        message: "Banner deleted successfully",
      });
    } catch (error) {
      console.error("Error in deleteBannerById:", error);
      res.status(500).json({
        success: false,
        status: "failed",
        error: {
          message: "Internal server error",
          details: error.message,
        },
      });
    }
};  
  

export { createBanner, getAllBannersDetails, getBannerById, updateBanner, deleteBannerById };