// import { Product } from "../../models/Product.model.ts";
// import { ApiError } from "../../utils/apiError.ts";

// export const calculateOrderPricing = async (items) => {
//   if (!Array.isArray(items) || items.length === 0) {
//     throw new ApiError(400, "No items provided for pricing");
//   }

//   const pricingItems = [];
//   let subtotal = 0;
//   let totalDiscount = 0;

//   for (const item of items) {
//     const { productId, selectedSize, selectedColor, quantity } = item;

//     // 1️⃣ Fetch product
//     const product = await Product.findById(productId)
//       .populate("discount") // if you use ref discount
//       .lean();

//     if (!product) {
//       throw new ApiError(404, "Product not found");
//     }

//     // 2️⃣ Find variant
//     const variant = product.varients.find(
//       (v) =>
//         v.size === selectedSize &&
//         v.color === selectedColor
//     );

//     if (!variant) {
//       throw new ApiError(400, "Selected variant unavailable");
//     }

//     // 3️⃣ Stock check
//     if (variant.stock < quantity) {
//       throw new ApiError(
//         400,
//         `Insufficient stock for ${product.title}`
//       );
//     }

//     const basePrice = product.base_price;
//     let discountAmountPerUnit = 0;

//     // 4️⃣ Discount Logic
//     if (product.discount) {
//       const now = new Date();

//       if (
//         (!product.discount.startDate || product.discount.startDate <= now) &&
//         (!product.discount.endDate || product.discount.endDate >= now)
//       ) {
//         if (product.discount.type === "percentage") {
//           discountAmountPerUnit =
//             (basePrice * product.discount.value) / 100;
//         }

//         if (product.discount.type === "fixed") {
//           discountAmountPerUnit = product.discount.value;
//         }
//       }
//     }

//     // Prevent negative price
//     discountAmountPerUnit = Math.min(discountAmountPerUnit, basePrice);

//     const finalUnitPrice = basePrice - discountAmountPerUnit;
//     const lineTotal = finalUnitPrice * quantity;

//     subtotal += basePrice * quantity;
//     totalDiscount += discountAmountPerUnit * quantity;

//     pricingItems.push({
//       productId: product._id,
//       productTitle: product.title,
//       selectedSize,
//       selectedColor,
//       quantity,
//       unitBasePrice: basePrice,
//       discountAmount: discountAmountPerUnit,
//       finalUnitPrice,
//       lineTotal,
//       variantId: variant._id,
//     });
//   }

//   const grandTotal = subtotal - totalDiscount;

//   return {
//     items: pricingItems,
//     subtotal,
//     totalDiscount,
//     grandTotal,
//   };
// };
