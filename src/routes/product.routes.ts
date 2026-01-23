import { Router } from "express";
import {
  addProducts,
  getProducts,
  removeProducts,
} from "../controllers/product.controller.ts";
import {
  verifyAdminRole,
  verifyJWT,
} from "../middlewares/authentication.middleware.ts";
import { upload } from "../middlewares/multer.middleware.ts";

const productRouter = Router();
productRouter.route("/").post(addProducts);
productRouter.route("/:id").delete(verifyJWT, verifyAdminRole, removeProducts);
productRouter.route("/").get(getProducts);
export default productRouter;
