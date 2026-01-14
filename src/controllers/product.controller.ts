import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { Product } from "../models/Product.model.ts";
import { ApiResponse } from "../utils/apiResponse.ts";

const addProducts = asyncHandler(async (req, res) => {
  //get all the necessary fields
  //validate fields
  //validate fields presense
  //1.validate string number array differently
  //2.check types of image,varient
  //3.check category,discount,brand has a valid mongoose id or not
  //4.create new Products
  //if succesfull then save it
  //create products

  const {
    title,
    description,
    base_price,
    images,
    brand,
    varients,
    category,
    discount,
  } = req.body;

  console.log(
    title,
    description,
    base_price,
    images,
    brand,
    varients,
    category,
    discount
  );
  //title validation
  if (!title || title.trim().length < 6) {
    throw new ApiError(400, "title is required");
  }

  //desc validation
  if (!description || description.trim().length < 20) {
    throw new ApiError(400, "description is required");
  }

  //price validation
  if (!base_price) {
    throw new ApiError(400, "price is required");
  }

  //array:image validation

  if (!Array.isArray(images) || !images.length) {
    throw new ApiError(400, "images must be a non-empty array");
  }

  //array:varients validation

  if (!Array.isArray(varients) || !varients.length) {
    throw new ApiError(400, "varients must be a non-empty array");
  }

  //mongoose objectId validation
  if (!mongoose.Types.ObjectId.isValid(category)) {
    throw new ApiError(400, "invalid category id");
  }

  if (!mongoose.Types.ObjectId.isValid(brand)) {
    throw new ApiError(400, "invalid brand id");
  }

  if (discount && !mongoose.Types.ObjectId.isValid(discount)) {
    throw new ApiError(400, "invalid discount id");
  }

  const new_product = await Product.create({
    title,
    description,
    base_price,
    brand,
    category,
    discount: discount ?? null,
    images,
    varients,
  });
  console.log(new_product);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        new_product,
        "new product succesfully added to database"
      )
    );
});

const removeProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = req.user;
  if (!user || user.role !== "admin") {
    throw new ApiError(400, "Permission denied");
  }

  const deleted_product = await Product.findByIdAndDelete(id);
  res
    .status(200)
    .json(new ApiResponse(200, deleted_product, "product deleted succesfully"));
});

const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {};
  //Product.find({category:'mobiles',title:{$regex:''phone,options:'i'},base_price:{$gte:''}})

  if (req.query.category) {
    filters.category = req.query.category;
  }

  if (req.query.search) {
    filters.title = {
      $regex: req.query.search,
      $options: "i",
    };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filters.base_price = {};
    if (req.query.minPrice) {
      filters.base_price.$gte = Number(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      filters.base_price.$lte = Number(req.query.maxPrice);
    }
  }

  const products = await Product.find(filters).skip(skip).limit(limit);
  const total = await Product.countDocuments(filters);
  res.status(200).json(
    new ApiResponse(200, {
      products,
      length: total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  );
});

export { addProducts, removeProducts, getProducts };
