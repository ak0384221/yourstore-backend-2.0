import { Router } from "express";

import { verifyJWT } from "../middlewares/authentication.middleware.ts";
import { addToCart } from "../controllers/cart.controller.ts";

const cartRouter = Router();
cartRouter.route("/").post(verifyJWT, addToCart);
// cartRouter.route("/:id").delete(verifyJWT, verifyAdminRole, removeProducts);

export default cartRouter;
