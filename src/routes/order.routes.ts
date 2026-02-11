import { Router } from "express";
import { validateSelectedItem } from "../middlewares/validateSelectedItem.middleware.ts";
import { verifyJWT } from "../middlewares/authentication.middleware.ts";
import { addOrder } from "../controllers/order.controller.ts";

const orderRouter = Router();
orderRouter.route("/").post(verifyJWT, addOrder);
// orderRouter.route("/").post(verifyJWT, getAllOrder);
// orderRouter.route("/:productid").delete(verifyJWT, removeFromCart);

export default orderRouter;
