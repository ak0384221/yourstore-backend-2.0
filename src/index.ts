import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { app } from "./app.ts";
import { connectDB } from "./database/index.ts";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log("server is running on ", process.env.PORT);
      console.log({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
      });
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!!", error);
  });
