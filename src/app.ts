import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = e();
app.use(cors({ origin: "*", credentials: true }));
app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(e.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.ts";
import { createCategories } from "./controllers/category.controller.ts";
import { createBrands } from "./controllers/brand.controller.ts";
import { createDiscount } from "./controllers/discount.controller.ts";

//routes declaration
app.use("/api/v1/auth", userRouter);
app.post("/api/v1/categories/:name", createCategories);
app.post("/api/v1/brands/:name", createBrands);
app.post("/api/v1/discounts", createDiscount);

export { app };
