import fs from "fs";

 export const uploadOnCloudinary = async (path) => {
  try {
    if (!path) throw new Error("File path is missing");

    const response = await cloudinary.uploader.upload(path, { resource_type: "auto" });

    // Remove the temporary file after upload
    fs.unlinkSync(path);
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Ensure temporary files are cleaned up in case of an error
    if (fs.existsSync(path)) fs.unlinkSync(path);
    return null;
  }
};

