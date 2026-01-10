import { Router } from "express";
import { addProducts } from "../controllers/product.controller.ts";
import {
  verifyAdminRole,
  verifyJWT,
} from "../middlewares/authentication.middleware.ts";

const productRouter = Router();
productRouter.route("/").post(verifyJWT, verifyAdminRole, addProducts);

export default productRouter;
