export const viewProjections = {
  LIST: [
    {
      $project: {
        title: 1,
        base_price: 1,
        final_price: 1,
        rating: 1,
        activeDiscounts: {
          _id: 1,
          title: 1,
          type: 1,
          amount: 1,
          applicableTo: 1,
          productIds: 1,
          categoryIds: 1,
          startDate: 1,
          endDate: 1,
        },
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
        activeDiscounts: {
          _id: 1,
          title: 1,
          type: 1,
          amount: 1,
          applicableTo: 1,
          productIds: 1,
          categoryIds: 1,
          startDate: 1,
          endDate: 1,
        },
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
            final_price: "$final_price",
            base_price: "$base_price",
            quantity: "$quantity",
            selectedSize: "$selectedSize",
            selectedColor: "$selectedColor",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        items: 1,
      },
    },
  ],
};
