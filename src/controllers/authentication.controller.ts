import { User } from "../models/User.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import jwt from "jsonwebtoken";

async function generateAccessAndRefreshToken(id: any) {
  try {
    const user = await User.findById(id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user?.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
}

const signUp = asyncHandler(async (req, res) => {
  //take data from req.body
  const { email, fullName, password, gender } = req.body;

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
    throw new ApiError(504, "email already exist");
  }

  //create new User
  const newUser = new User({ email, fullName, password, gender });
  const response = await newUser.save();

  //do a new query to find the user and fnally return only surface level data
  const myUser = await User.findById(response._id).select(
    "-password -refreshToken"
  );

  res.status(200).json(new ApiResponse(200, myUser));
});

const login = asyncHandler(async function (req, res) {
  //getting email and pass from body
  const { email, password } = req.body;
  //validating props
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(404, "email and password is required");
  }
  //checking is user already exist
  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new ApiError(500, "Invalid credentials");
  }

  //matching password
  const isPassValid = await existedUser.isPasswordCorrect(password);
  //generate access,refresg tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existedUser._id
  );

  const options = {
    httpOnly: true,
    secure: false,
  };
  //gettng the logged in users data
  const loggedInUser = await User.findById(existedUser._id).select(
    "-password -refreshToken"
  );
  // returning user data along with tokens
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "logged in successfully"
      )
    );
});

const logout = asyncHandler(async function (req, res) {
  const user = req.user;
  if (!user) {
    throw new ApiError(505, "coudnt find user");
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "logged out"));
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
  const user = await User.findById(decoded.id);
  //find user and validate
  if (!user) {
    throw new ApiError(505, "no user found");
  }

  //match the ref tokens
  if (token !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired");
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
  const isPasswordCorrect = await user.isPasswordCorrect(oldPass);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid credentials");
  }

  user.password = newPass;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "pass changed"));
});

export { signUp, login, logout, refreshAccessToken, changePassword };
