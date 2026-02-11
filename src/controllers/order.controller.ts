import { normalizeOrderInput } from "../service/order/normalizeOrderInput.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const addOrder = asyncHandler(async (req, res) => {
  //need user id that will be found in req.user
  //need pay method a string
  //need items[]
  //need [{productId,color,size,quantity}]
  //need to caculate
  // const validatedItem = {
  //     productId: product._id,
  //     productTitle: product.title,
  //     category: product.category,
  //     brand: product.brand,
  //     base_price: product.base_price,
  //     selectedSize,
  //     quantity,
  //     selectedColor,
  //     variantId: variant._id,
  //   };

  const obj = {
    productId: "objectId",
    color: "red",
    size: 56,
    base_price: 598,
    final_price: 500,
    discount: "objectId",
    quantity: 2,
    subtotal: 100,
  };
  const order = {
    user: "objectId",
    status: "placed",
    paymentMethod: "COD",
    totalAmount: 1000,
    itemCount: 1,
    items: [
      {
        productId: "objectId",
        color: "red",
        size: 56,
        base_price: 598,
        final_price: 500,
        discount: "objectId",
        quantity: 2,
        subtotal: 100,
      },
    ],
  };
  const normalized = normalizeOrderInput(req.body);

  res.json(normalized);
});

const getOrder = asyncHandler(async (req, res) => {});

const getAllOrder = asyncHandler(async (req, res) => {});

export { getOrder, getAllOrder, addOrder };
