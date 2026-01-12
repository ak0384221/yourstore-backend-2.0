import { Cart } from "../models/Cart.model.ts";
import { Product } from "../models/Product.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const addToCart = asyncHandler(async (req, res) => {
  //get id,size,color and the user
  //validate inputs
  //check if that specfic user has already the specific product with same atrribute or not
  //if same then update the quantity andif not then add another cart
  //-----------------------//
  const { productId, selectedSize, selectedColor, selectedQuantity } = req.body;
  const user = req.user;
  if (
    !productId ||
    !selectedSize ||
    !selectedColor ||
    selectedQuantity == null ||
    selectedQuantity == 0
  ) {
    throw new ApiError(400, "fields must not be empty");
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

export { addToCart };
