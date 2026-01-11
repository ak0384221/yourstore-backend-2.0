import { Router } from "express";
import {
  addProducts,
  removeProducts,
} from "../controllers/product.controller.ts";
import {
  verifyAdminRole,
  verifyJWT,
} from "../middlewares/authentication.middleware.ts";

const productRouter = Router();
productRouter.route("/").post(verifyJWT, verifyAdminRole, addProducts);
productRouter.route("/:id").delete(verifyJWT, verifyAdminRole, removeProducts);

export default productRouter;
