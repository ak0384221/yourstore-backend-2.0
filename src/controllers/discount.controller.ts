import { Discount } from "../models/Discount.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const createDiscount = asyncHandler(async (req, res) => {
  //get the params
  //validation needed => if discount is for category then category ids should not be empty
  //if it is for products then products ids should not be empty

  const {
    title,
    amount,
    type,
    applicableTo,
    productIds,
    categoryIds,
    startDate,
    endDate,
  } = req.body;

  //common fields that are always needed
  if (
    [title, amount, type, applicableTo, startDate, endDate].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "all fields must be sent");
  }

  //for discount type === product

  if (applicableTo === "product") {
    if (!productIds || productIds.length === 0) {
      throw new ApiError(400, "products ids must not empty");
    } else {
      const newDiscount = await Discount.create({
        title,
        amount,
        type,
        applicableTo,
        productIds,
        startDate,
        endDate,
      });
      console.log(newDiscount);
      return res.status(200).json(new ApiResponse(200, "discount added"));

      //db call
      //response send
    }
  }

  //for discount type === category

  if (applicableTo === "category") {
    if (!categoryIds || categoryIds.length === 0) {
      throw new ApiError(400, "categoryIds  must not empty");
    } else {
      //db call
      const newDiscount = await Discount.create({
        title,
        amount,
        type,
        applicableTo,
        categoryIds,
        startDate,
        endDate,
      });
      console.log(newDiscount);
      return res.status(200).json(new ApiResponse(200, "discount added"));
      //response send
    }
  }

  //for discount type === all
  //db call

  const newDiscount = await Discount.create({
    title,
    amount,
    type,
    applicableTo,
    startDate,
    endDate,
  });
  console.log(newDiscount);
  return res.status(200).json(new ApiResponse(200, "discount added"));
});

export { createDiscount };
