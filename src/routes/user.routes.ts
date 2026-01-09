import { Router } from "express";
import {
  changePassword,
  login,
  logout,
  refreshAccessToken,
  signUp,
} from "../controllers/authentication.controller.ts";
import { verifyJWT } from "../middlewares/authentication.middleware.ts";

const UserRouter = Router();

UserRouter.route("/signUp").post(signUp);
UserRouter.route("/login").post(login);
UserRouter.route("/logout").post(verifyJWT, logout);
UserRouter.route("/refresh").post(refreshAccessToken);
UserRouter.route("/changePassword").post(verifyJWT, changePassword);

export default UserRouter;
