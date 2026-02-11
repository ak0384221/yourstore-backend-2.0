import { Product } from "../models/Product.model.ts";
import { ApiError } from "../utils/apiError.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

/**
 * Middleware to validate product, variant, and quantity
 * Can be used in addToCart, direct order, or other routes
 */
const validateSelectedItem = asyncHandler(async (req, res, next) => {
  const { productId, selectedSize, selectedColor, selectedQuantity } = req.body;

  // 1️⃣ Basic input validation
  if (!productId || !selectedSize || !selectedColor || !selectedQuantity) {
    throw new ApiError(400, "All fields are required");
  }
  if (selectedQuantity <= 0) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  // 2️⃣ Fetch product from DB
  const product = await Product.findById(productId).lean();
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // 3️⃣ Check variant availability
  const variant = product.varients.find(
    (v) =>
      v.size === selectedSize &&
      v.color === selectedColor &&
      v.stock >= selectedQuantity
  );

  if (!variant) {
    throw new ApiError(
      400,
      "Selected variant unavailable or insufficient stock"
    );
  }

  // 4️⃣ Attach validated info to request for downstream use
  req.validatedItem = {
    productId: product._id,
    productTitle: product.title,
    brand: product.brand,
    category: product.category,
    base_price: product.base_price,
    final_price: product.final_price, // can recalc if needed
    activeDiscounts: product.activeDiscounts || [],
    selectedSize,
    selectedColor,
    quantity: selectedQuantity,
    variantId: variant._id,
  };

  next();
});

export { validateSelectedItem };
