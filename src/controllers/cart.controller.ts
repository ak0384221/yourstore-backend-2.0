import mongoose from "mongoose";
import { Cart } from "../models/Cart.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { getCartService } from "../service/cart.service.ts";

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, selectedSize, selectedColor, quantity } =
    req.validatedItem;

  // Cart limit check (optional)
  const cartCount = await Cart.countDocuments({ userId });
  if (cartCount >= 20) {
    throw new ApiError(400, "Cart is full, cannot add more than 20 items");
  }

  // 1️⃣ Try to insert if not exists
  const cartItem = await Cart.findOneAndUpdate(
    {
      userId,
      product: productId,
      selectedSize,
      selectedColor,
    },
    {
      $setOnInsert: {
        userId,
        product: productId,
        selectedSize,
        selectedColor,
        selectedQuantity: quantity,
      },
    },
    {
      upsert: true, // insert if not exists
      new: true, // return the document after update/insert
      includeResultMetadata: true, // get info about whether it was inserted
    }
  );
  console.log(cartItem.lastErrorObject?.upserted);
  // 2️⃣ Check if the item was already present
  if (!cartItem.lastErrorObject?.upserted) {
    throw new ApiError(
      400,
      "This product with the selected variant already exists in your cart"
    );
  }

  // 3️⃣ Successfully inserted
  res
    .status(200)
    .json(new ApiResponse(200, cartItem.value, "Cart item added successfully"));
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
