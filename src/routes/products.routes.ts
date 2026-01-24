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

const productsRouter = Router();
productsRouter.route("/").post(addProducts);
productsRouter.route("/:id").delete(verifyJWT, verifyAdminRole, removeProducts);
productsRouter.route("/").get(getProducts);

export default productsRouter;
