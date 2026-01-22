import { Brand } from "../models/Brand.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const createBrands = asyncHandler(async (req, res) => {
  //get the name from body
  //trim and check if length not empty
  //transform in lowercase and use reg for spaces
  //check if already present or not
  //add to db category

  const { name } = req.params;
  console.log(name);

  if (!name || name.trim() === "") {
    throw new ApiError(400, "brand name is required");
  }

  const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
  console.log(slug);

  const existing = await Brand.findOne({ slug });
  if (existing) {
    throw new ApiError(500, "Brand already exist");
  }

  const newBrand = await Brand.create({
    name: name.trim(),
    slug,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newBrand, "new brand created"));
});

const getAllBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.find();
  res
    .status(200)
    .json(new ApiResponse(200, brand, "all Brand succesfully extacted"));
});

export { createBrands, getAllBrand };
