import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = e();
app.set("trust proxy", 1);
app.use(cors({ origin: "*", credentials: true }));
app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(e.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.ts";
import {
  createCategories,
  getAllCategory,
} from "./controllers/category.controller.ts";
import { createBrands, getAllBrand } from "./controllers/brand.controller.ts";
import { createDiscount } from "./controllers/discount.controller.ts";
import productsRouter from "./routes/products.routes.ts";
import {
  verifyAdminRole,
  verifyJWT,
} from "./middlewares/authentication.middleware.ts";
import cartRouter from "./routes/cart.routes.ts";
import {
  createReturnPolicy,
  getAllReturnPolicy,
} from "./controllers/returnPolicy.controller.ts";
import productRouter from "./routes/product.route.ts";
import { errorHandler } from "./middlewares/GError.middleware.ts";

//routes declaration

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/product", productRouter);

app.use("/api/v1/cart", cartRouter);
app.post(
  "/api/v1/categories/:name",
  verifyJWT,
  verifyAdminRole,
  createCategories
);
app.get("/api/v1/categories", getAllCategory);
app.post("/api/v1/brands/:name", verifyJWT, verifyAdminRole, createBrands);
app.get("/api/v1/brands", getAllBrand);
app.post("/api/v1/discounts", verifyJWT, verifyAdminRole, createDiscount);
app.post(
  "/api/v1/returnPolicy",
  verifyJWT,
  verifyAdminRole,
  createReturnPolicy
);
app.post("/api/v1/warrantyInfo", verifyJWT, verifyAdminRole, createDiscount);

app.use(errorHandler);
export { app };
