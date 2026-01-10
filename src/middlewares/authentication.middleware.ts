import { User } from "../models/User.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies || req.header("Authorization")?.replace("Bearer", "");
  if (!token) {
    throw new ApiError(404, "unauthorized");
  }
  const decoded = jwt.verify(
    token.accessToken,
    process.env.ACCESS_TOKEN_SECRET!
  );

  const user = await User.findById(decoded?.id).select(
    "-password -refreshToken"
  );

  req.user = user;

  next();
});

const verifyAdminRole = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (user.role != "admin") {
    throw new ApiError(404, "unauthorized");
  }
  next();
});
export { verifyJWT, verifyAdminRole };
