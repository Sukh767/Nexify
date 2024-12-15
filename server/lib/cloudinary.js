import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadOnCloudinary = async (path, retries = 3) => {
  try {
    if (!path) throw new Error("File path is missing");

    const response = await cloudinary.uploader.upload(path, { resource_type: "auto" });

    // Remove the temporary file after upload
    fs.unlinkSync(path);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Retry logic for timeout errors
    if (retries > 0 && error.error?.http_code === 499) {
      console.log(`Retrying upload... Attempts left: ${retries - 1}`);
      return uploadOnCloudinary(path, retries - 1);
    }

    // Ensure temporary files are cleaned up in case of an error
    if (fs.existsSync(path)) fs.unlinkSync(path);
    return null;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    console.log('these is deleteFromCloudinary', publicId)
    const result = await cloudinary.delete_resources(publicId, options).then(callback);
    console.log(`Deleted ${publicId} from Cloudinary`);
    return result;
  } catch (error) {
    console.error(`Failed to delete ${publicId} from Cloudinary`, error);
    throw error;
  }
};