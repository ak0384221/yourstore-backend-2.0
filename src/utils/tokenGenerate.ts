import jwt from "jsonwebtoken";
import { UserSchema } from "../models/User.model.ts";

function generateAccessToken(id: string) {
  const payload = {
    sub: id,
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(session) {
  const payload = {
    jti: session._id,
  };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
}

export { generateAccessToken, generateRefreshToken };
