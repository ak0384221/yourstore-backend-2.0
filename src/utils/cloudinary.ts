import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!, // Click 'View API Keys' above to copy your API secret
});
console.log({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

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
