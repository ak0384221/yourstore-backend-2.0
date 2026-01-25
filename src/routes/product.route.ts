import { Router } from "express";
import {
  addProduct,
  getOneProduct,
  getProducts,
  removeProduct,
} from "../controllers/product.controller.ts";
import {
  verifyAdminRole,
  verifyJWT,
} from "../middlewares/authentication.middleware.ts";
import { upload } from "../middlewares/multer.middleware.ts";

const productRouter = Router();
productRouter.route("/").post(upload.array("images", 3), addProduct);
productRouter.route("/:id").delete(verifyJWT, verifyAdminRole, removeProduct);
productRouter.route("/:productId").get(getOneProduct);

export default productRouter;
