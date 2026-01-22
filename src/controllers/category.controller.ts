import { Category } from "../models/Category.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const createCategories = asyncHandler(async (req, res) => {
  //get the name from body
  //trim and check if length not empty
  //transform in lowercase and use reg for spaces
  //check if already present or not
  //add to db category

  const { name } = req.params;
  console.log(name);

  if (!name || name.trim() === "") {
    throw new ApiError(400, "category name is required");
  }

  const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
  console.log(slug);

  const existing = await Category.findOne({ slug });
  if (existing) {
    throw new ApiError(500, "category already exist");
  }

  const newCategory = await Category.create({
    name: name.trim(),
    slug,
  });

  // console.log("successfully created category", name);
  return res
    .status(200)
    .json(new ApiResponse(200, newCategory, "new category created"));
});

const getAllCategory = asyncHandler(async (req, res) => {
  const category = await Category.find();
  res
    .status(200)
    .json(new ApiResponse(200, category, "all category succesfully extacted"));
});

export { createCategories, getAllCategory };
