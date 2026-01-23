import { Product } from "../models/Product.model.ts";
import { ReturnPolicy } from "../models/ReturnPolicy.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const createReturnPolicy = asyncHandler(async (req, res) => {
  const { title, policy, returnInDays } = req.body;
  if (
    [title, policy, returnInDays].some((field) => !field || field.trim() == "")
  ) {
    throw new ApiError(404, "required field is missing or empty");
  }

  const newPolicy = await ReturnPolicy.create({ title, policy, returnInDays });
  console.log(newPolicy);

  return res
    .status(200)
    .json(new ApiResponse(200, newPolicy, "new policy created"));
});

const getAllReturnPolicy = asyncHandler(async (req, res) => {
  const returnPolicy = await ReturnPolicy.find();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        returnPolicy,
        "all ReturnPolicy succesfully extacted"
      )
    );
});

export { createReturnPolicy, getAllReturnPolicy };
