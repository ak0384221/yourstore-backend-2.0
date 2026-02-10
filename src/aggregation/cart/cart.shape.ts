export const cartShapeStages = [
  {
    $lookup: {
      from: "products",
      localField: "product",
      foreignField: "_id",
      as: "product",
    },
  },
  { $unwind: "$product" },

  // 🔑 normalize to PRODUCT SHAPE + KEEP CART FIELDS
  {
    $addFields: {
      _productId: "$product._id",

      // product shape
      title: "$product.title",
      base_price: "$product.base_price",
      rating: "$product.rating",
      images: "$product.images",

      category: "$product.category",
      brand: "$product.brand",
      discount: "$product.discount",
      return_policy: "$product.return_policy",
      warranty_info: "$product.warranty_info",

      // cart fields (CRITICAL)
      quantity: "$selectedQuantity",
      selectedSize: "$selectedSize",
      selectedColor: "$selectedColor",

      userId: "$userId",
      createdAt: "$createdAt",
      updatedAt: "$updatedAt",
    },
  },

  // remove nested product only
  {
    $project: {
      product: 0,
    },
  },
];
