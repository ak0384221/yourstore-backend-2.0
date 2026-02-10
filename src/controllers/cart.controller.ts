import mongoose from "mongoose";
import { Cart } from "../models/Cart.model.ts";
import { Product } from "../models/Product.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getCartService } from "../service/cart.service.ts";

const addToCart = asyncHandler(async (req, res) => {
  //get id,size,color and the user
  //validate inputs
  //check if that specfic user has already the specific product with same atrribute or not
  //if same then update the quantity andif not then add another cart
  //-----------------------//
  const { productId, selectedSize, selectedColor, selectedQuantity } = req.body;
  const user = req.user;
  console.log("prosuct id", productId);
  if (
    !productId ||
    !selectedSize ||
    !selectedColor ||
    selectedQuantity == null ||
    selectedQuantity == 0
  ) {
    throw new ApiError(400, "fields must not be empty");
  }
  //0 check the limit
  const isLimitExceed = await Cart.countDocuments({ userId: user._id });
  if (isLimitExceed > 20) {
    throw new ApiError(500, "cart is full, cannot add more than 20");
  }

  //1.find the user cart from cart
  const existedCartItem = await Cart.findOne({
    userId: user._id,
    product: productId,
    selectedSize,
    selectedColor,
  });

  if (!existedCartItem) {
    const isProductAvailable = await Product.findById(productId);

    console.log("product", isProductAvailable);
    if (!isProductAvailable) {
      throw new ApiError(400, "product unavailable");
    }

    //check 2 => varients availabilty
    const isVariantAvailable = isProductAvailable.varients.find((v) => {
      return (
        v.size === selectedSize &&
        v.color === selectedColor &&
        v.stock >= selectedQuantity
      );
    });
    if (!isVariantAvailable) {
      throw new ApiError(400, "product unavailable");
    }

    //create new cart item
    const newCartItem = await Cart.create({
      userId: user._id,
      product: productId,
      selectedColor,
      selectedSize,
      selectedQuantity,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newCartItem, "cart item added succesfully"));
  }

  existedCartItem.selectedQuantity += Number(selectedQuantity);
  const updatedItem = await existedCartItem.save();
  res
    .status(200)
    .json(new ApiResponse(200, updatedItem, "cart item added succesfully"));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productid } = req.params;
  if (!productid || productid == "") {
    throw new ApiError(400, "id is required");
  }
  const user = req.user;

  const cartItem = await Cart.findOneAndDelete({
    userId: user._id,
    product: productid,
  });
  if (!cartItem) {
    throw new ApiError(500, "cannot find the item !!!");
  }

  res.status(200).json(new ApiResponse(200, cartItem, "item deleted"));
});

const getAllCart = asyncHandler(async (req, res) => {
  const user = req.user;
  // const userCartItems = await Cart.find({ userId: user._id });

  const _id = new mongoose.Types.ObjectId(user._id);

  const { cart, totalItems } = await getCartService(req.user._id);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        cart,
        totalItems,
      },
      "cart items"
    )
  );
});

export { addToCart, removeFromCart, getAllCart };
