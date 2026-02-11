import { Router } from "express";

import { verifyJWT } from "../middlewares/authentication.middleware.ts";
import {
  addToCart,
  getAllCart,
  removeFromCart,
} from "../controllers/cart.controller.ts";
import { validateSelectedItem } from "../middlewares/validateSelectedItem.middleware.ts";

const cartRouter = Router();
cartRouter.route("/").get(verifyJWT, getAllCart);
cartRouter.route("/").post(verifyJWT, validateSelectedItem, addToCart);
cartRouter.route("/:productid").delete(verifyJWT, removeFromCart);

export default cartRouter;
