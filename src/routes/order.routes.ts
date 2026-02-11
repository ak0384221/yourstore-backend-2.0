import { Router } from "express";

import { verifyJWT } from "../middlewares/authentication.middleware.ts";
import { addOrder, getAllOrder } from "../controllers/order.controller.ts";
import { validateSelectedItem } from "../middlewares/validateSelectedItem.middleware.ts";

const orderRouter = Router();
orderRouter.route("/").get(verifyJWT, validateSelectedItem, addOrder);
orderRouter.route("/").post(verifyJWT, getAllOrder);
// orderRouter.route("/:productid").delete(verifyJWT, removeFromCart);

export default orderRouter;
