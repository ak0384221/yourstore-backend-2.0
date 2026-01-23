import { ReturnPolicy } from "../models/ReturnPolicy.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const createWarranty = asyncHandler(async (req, res) => {
  const { title, policy, returnInDays } = req.body;
  if (
    [title, policy, returnInDays].some((field) => !field || field.trim() == "")
  ) {
    throw new ApiError(404, "required field is missing or empty");
  }

  // if (typeof returnInDays !== "number") {
  //   throw new ApiError(404, "return days should be a number type");
  // }

  const newPolicy = await ReturnPolicy.create({ title, policy, returnInDays });
  console.log(newPolicy);

  return res
    .status(200)
    .json(new ApiResponse(200, newPolicy, "new policy created"));
});

const getAllWarrantyInfo = asyncHandler(async (req, res) => {
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

export { createWarranty, getAllWarrantyInfo };
