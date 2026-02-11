import { Product } from "../models/Product.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

/**
 * Middleware to validate product, variant, and quantity
 * Can be used in addToCart, direct order, or other routes
 */
const validateSelectedItem = asyncHandler(async (req, res, next) => {
  const { productId, selectedSize, selectedColor, quantity = 1 } = req.body;

  // 1️⃣ Basic input validation
  if (!productId || !selectedSize || !selectedColor || !quantity) {
    throw new ApiError(400, "All fields are required");
  }

  // 2️⃣ Fetch product from DB
  const product = await Product.findById(productId).lean();
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // 3️⃣ Check variant availability`
  const variant = product.varients.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  if (!variant) {
    throw new ApiError(
      400,
      "Selected variant unavailable or insufficient stock"
    );
  }

  // 4️⃣ Attach validated info to request for downstream use
  const validatedItem = {
    productId: product._id,
    productTitle: product.title,
    category: product.category,
    brand: product.brand,
    base_price: product.base_price,
    selectedSize,
    quantity,
    selectedColor,
    variantId: variant._id,
  };
  req.validatedItem = validatedItem;

  next();
});

export { validateSelectedItem };
