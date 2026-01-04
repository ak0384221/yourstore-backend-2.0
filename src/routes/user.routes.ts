import { Router } from "express";
import {
  login,
  logout,
  signUp,
} from "../controllers/authentication.controller.ts";
import { verifyJWT } from "../middlewares/authentication.middleware.ts";
const router = Router();

router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);

export default router;
