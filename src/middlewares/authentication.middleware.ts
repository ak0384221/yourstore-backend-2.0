import { User } from "../models/User.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import jwt from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies || req.header("Authorization")?.replace("Bearer", "");
  console.log(token);
  if (!token) {
    throw new ApiError(404, "unauthorized");
  }
  const decoded = jwt.verify(
    token.accessToken,
    process.env.ACCESS_TOKEN_SECRET!
  );

  console.log("decoded token is", decoded);
  const user = await User.findById(decoded?.id).select(
    "-password -refreshToken"
  );
  console.log("user is", user);

  req.user = user;

  next();
});

export { verifyJWT };
