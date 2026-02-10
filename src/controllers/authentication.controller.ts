import { User } from "../models/User.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import jwt from "jsonwebtoken";
import { isPasswordCorrect } from "../utils/password.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGenerate.ts";
import { AuthSession } from "../models/refreshToken.model.ts";
import bcrypt from "bcrypt";

async function generateAccessAndRefreshToken(id: any, userAgent, ip) {
  try {
    // const user = await User.findById(id);
    const expiresAt = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day
    const result = await AuthSession.create({
      userId: id,
      isRevoked: false,
      expiresAt: expiresAt,
      ip: ip,
      userAgent: userAgent,
    });
    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(result);

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      400,
      "Something went wrong while generating referesh and access token"
    );
  }
}

const signUp = asyncHandler(async (req, res) => {
  //take data from req.body
  const { email, fullName, password, gender } = req.body;
  const start = Date.now();
  const minResTime = 500;

  //validate if there is all data
  if (
    [email, fullName, password, gender].some(
      (field) => !field || field?.trim() === ""
    )
  ) {
    throw new ApiError(404, "all the fields are required");
  }

  //check if existed
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    const elapsed = Date.now() - start;
    if (elapsed < minResTime) {
      await new Promise((r) => setTimeout(r, minResTime - elapsed));
    }
    throw new ApiError(504, "email already exist");
  }

  //create new User
  const newUser = await User.create({ email, fullName, password, gender });

  //do a new query to find the user and finally return only surface level data
  const elapsed = Date.now() - start;
  if (elapsed < minResTime) {
    await new Promise((r) => setTimeout(r, minResTime - elapsed));
  }

  res.status(200).json(new ApiResponse(200, "user created successfully"));
});

const login = asyncHandler(async function (req, res) {
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const start = Date.now();
  const minResTime = 500;
  const genericMsg = "Invalid Credentials";
  //getting email and pass from body
  const { email, password } = req.body;
  //validating props
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(404, "email and password is required");
  }
  //checking is user already exist
  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    const elapsed = Date.now() - start;
    if (elapsed < minResTime) {
      await new Promise((r) => setTimeout(r, minResTime - elapsed));
    }
    throw new ApiError(404, "Invalid credentials");
  }

  //matching password
  const isPassValid = await isPasswordCorrect(existedUser, password);
  //generate access,refresg tokens
  if (!isPassValid) {
    throw new ApiError(404, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existedUser._id,
    userAgent,
    ip
  );

  const options = {
    httpOnly: true,
    secure: false,
  };
  //gettng the logged in users data
  const elapsed = Date.now() - start;
  if (elapsed < minResTime) {
    await new Promise((r) => setTimeout(r, minResTime - elapsed));
  }
  // returning user data along with tokens
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "logged in successfully"));
});

const logout = asyncHandler(async function (req, res) {
  const refreshToken =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer", "").trim();

  if (!refreshToken) {
    throw new ApiError(401, "No token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  // jti = session _id
  const sessionId = decoded.jti;

  const response = await AuthSession.findByIdAndUpdate(sessionId, {
    isRevoked: true,
  });
  res
    .cookie("accessToken", "", { httpOnly: true, expires: new Date(0) })
    .cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) })
    .status(200)
    .json({ message: "Logged out successfully" });
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  //get the ref token from body
  const token = req.cookies.refreshToken || req.body.refreshToken;
  //if not found => error
  if (!token) {
    throw new ApiError(401, "unauthorized req");
  }
  //decode ref token
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
  //db query by id
  const user = await AuthSession.findById(decoded.jti);
  //find user and validate
  if (!user) {
    throw new ApiError(505, "Error");
  }

  //match the ref tokens
  if (user.isRevoked) {
    throw new ApiError(401, "Revoked");
  } //dontmatch=>err

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  //gen new access and refresh token
  const options = {
    httpOnly: true,
    secure: false,
  };
  //update db ref token and set new cookie
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "access Token Refreshed"
      )
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPass, newPass } = req.body;
  const user = await User.findById(req.user._id);

  // 1️⃣ Verify old password
  const isCorrect = await isPasswordCorrect(user, oldPass);
  if (!isCorrect) {
    throw new ApiError(400, "Invalid current password");
  }

  // 2️⃣ Optional: Validate password strength
  if (newPass.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  // 3️⃣ Update password
  user.password = newPass; // pre-save hook will hash it
  await user.save(); // do NOT skip validation

  // 4️⃣ Revoke all sessions
  await AuthSession.updateMany(
    { userId: user._id, isRevoked: false },
    { isRevoked: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export { signUp, login, logout, refreshAccessToken, changePassword };
