import dotenv from "dotenv";
import { app } from "./app.ts";
import { connectDB } from "./database/index.ts";
dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log("server is running on ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!!", error);
  });
