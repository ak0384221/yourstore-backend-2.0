import { Router } from "express";
import {
  addProducts,
  getOneProduct,
  getProducts,
  removeProducts,
} from "../controllers/product.controller.ts";
import {
  verifyAdminRole,
  verifyJWT,
} from "../middlewares/authentication.middleware.ts";
import { upload } from "../middlewares/multer.middleware.ts";

const productRouter = Router();
// productRouter.route("/").post(addProducts);
// productRouter.route("/:id").delete(verifyJWT, verifyAdminRole, removeProducts);
// productRouter.route("/").get(getProducts);
productRouter.route("/:productId").get(getOneProduct);

export default productRouter;
