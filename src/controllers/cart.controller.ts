import { Cart } from "../models/Cart.model.ts";
import { Product } from "../models/Product.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { ApiResponse } from "../utils/apiResponse.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const addToCart = asyncHandler(async (req, res) => {
  //get id,size,color
  //validate inputs
  // 1.check the user is existed or not
  // 2.if not then  - validate product and varients and create one and insert into the cart
  // 3.if existed then check the array items and check if the product is existed wit the exact varients
  // 4.if same then update the quntity
  // 5.if not same then include one more item of the new product in the cart

  //getting the fields
  const { productId, selectedSize, selectedColor, selectedQuantity } = req.body;
  console.log(productId, selectedSize, selectedColor, selectedQuantity);
  //get the user
  const user = req.user;
  //validate fields
  if (
    [productId, selectedSize, selectedColor, selectedQuantity].some(
      (field) => !field || field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "fields must not be empty");
  }
  //-------------------------------------------------------------------------------//

  //1.find the user from cart
  const userExisted = await Cart.findById(user._id);

  //2.if not found create new cart
  if (!userExisted) {
    //check 1 => products availabilty
    const productAvailable = await Product.findById(productId);
    if (!productAvailable) {
      throw new ApiError(400, "product unavailable");
    }

    //check 2 => varients availabilty
    const variantAvailable = productAvailable.varients.find((v) => {
      return (
        v.size === selectedSize &&
        v.color === selectedColor &&
        v.stock >= selectedQuantity
      );
    });
    if (!variantAvailable) {
      throw new ApiError(400, "product unavailable");
    }
    //create new cart item
    const newCartItem = await Cart.create({
      userId: user._id,
      items: [
        {
          product: productId,
          selectedColor,
          selectedSize,
          selectedQuantity,
        },
      ],
    });

    res
      .status(200)
      .json(new ApiResponse(200, newCartItem, "cart item added succesfully"));
  }

  //3.if user found/existed
  //check if it is the same
  if (userExisted) {
    const existingItem = userExisted.items.find(
      (item) =>
        item.product.toString() === productId.toString() &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );
    if (existingItem) {
      if (existingItem.selectedQuantity === selectedQuantity) {
        // Exact same item already in cart → reject
        throw new ApiError(500, "product already existed");
      } else {
        // Quantity is different → update quantity
        existingItem.selectedQuantity = selectedQuantity;
        await userExisted.save();

        res
          .status(200)
          .json(
            new ApiResponse(200, "cart items quantity updated succesfully")
          );
      }
    } else {
      //check 1 => products availabilty
      const productAvailable = await Product.findById(productId);
      if (!productAvailable) {
        throw new ApiError(400, "product unavailable");
      }

      //check 2 => varients availabilty
      const variantAvailable = productAvailable.varients.find((v) => {
        return (
          v.size === selectedSize &&
          v.color === selectedColor &&
          v.stock >= selectedQuantity
        );
      });
      if (!variantAvailable) {
        throw new ApiError(400, "product unavailable");
      }
      //create new cart item
      const newCartItem = await Cart.create({
        userId: user._id,
        items: [
          {
            product: productId,
            selectedColor,
            selectedSize,
            selectedQuantity,
          },
        ],
      });

      res
        .status(200)
        .json(new ApiResponse(200, newCartItem, "cart item added succesfully"));
    }
  }
});

export { addToCart };
