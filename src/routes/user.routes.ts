import { Router } from "express";
import {
  changePassword,
  login,
  logout,
  refreshAccessToken,
  signUp,
} from "../controllers/authentication.controller.ts";
import { verifyJWT } from "../middlewares/authentication.middleware.ts";

const router = Router();

router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh").post(refreshAccessToken);
router.route("/changePassword").post(verifyJWT, changePassword);

export default router;
