import { ApiError } from "../../utils/apiError.ts";

const normalizeOrderInput = (body) => {
  let items = [];

  if (Array.isArray(body.items)) {
    items = body.items;
  } else {
    items = [body];
  }

  if (!items.length) {
    throw new ApiError(400, "No items provided");
  }

  const normalized = items.map((item) => {
    const { productId, selectedSize, selectedColor, quantity } = item;

    if (!productId || !selectedSize || !selectedColor || !quantity) {
      throw new ApiError(400, "Invalid item structure");
    }

    return {
      productId,
      selectedSize,
      selectedColor,
      quantity: Number(quantity),
    };
  });

  return normalized;
};
export { normalizeOrderInput };
