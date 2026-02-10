export const viewProjections = {
  LIST: [
    {
      $project: {
        title: 1,
        base_price: 1,
        final_price: 1,
        rating: 1,
        activeDiscounts: 1,
        brand: { _id: 1, name: 1, slug: 1 },
        category: { _id: 1, name: 1, slug: 1 },
        images: { $slice: ["$images", 2] },
      },
    },
  ],
  DETAIL: [
    {
      $project: {
        title: 1,
        description: 1,
        base_price: 1,
        final_price: 1,
        rating: 1,
        activeDiscounts: 1,
        brand: { _id: 1, name: 1, slug: 1 },
        category: { _id: 1, name: 1, slug: 1 },
        images: 1,
        varients: 1,
        dimensions: 1,
        return_policy: 1,
        warranty_info: 1,
      },
    },
  ],
  CART: [
    {
      $addFields: {
        item_total: {
          $multiply: ["$quantity", "$final_price"],
        },
      },
    },
    {
      $group: {
        _id: "$userId",
        items: {
          $push: {
            productId: "$_productId",
            title: "$title",
            images: "$images",
            brand: "$brand",
            activeDiscounts: "$activeDiscounts",

            category: "$category",
            price: "$final_price",
            base_price: "$base_price",
            quantity: "$quantity",
            selectedSize: "$selectedSize",
            selectedColor: "$selectedColor",
            item_total: "$item_total",
          },
        },
        cart_total: { $sum: "$item_total" },
      },
    },
  ],
};
