// import dotenv from "dotenv";
// dotenv.config();
import fs from "fs";
import cloudinary from "../config/cloudinary.ts";

// Upload an image

async function uploadOnCloudinary(localFilePath: string) {
  if (!localFilePath) return "local path didint found";
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("upload succesfull", response.url);
    return response;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    console.log(err);
    return null;
  }
}

export { uploadOnCloudinary };
