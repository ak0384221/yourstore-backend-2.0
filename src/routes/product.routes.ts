import { Router } from "express";
import { addProducts } from "../controllers/product.controller.ts";

const productRouter = Router();
productRouter.route("/").post(addProducts);

export default productRouter;
