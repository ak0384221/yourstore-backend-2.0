import { User } from "../models/User.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

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
  const { email, password } = req.body;
  if ([email, password].some((field) => !field || field.trim() === "")) {
    throw new ApiError(404, "email and password is required");
  }

  const existedUser = await User.findOne({ email });
  if (!existedUser) {
    throw new ApiError(500, "Invalid credentials");
  }
  const isPassValid = await existedUser.isPasswordCorrect(password);
  res.json(isPassValid);
});

export { signUp, login };
