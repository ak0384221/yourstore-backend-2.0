export const viewProjections = {
  LIST: [
    {
      $project: {
        title: 1,
        base_price: 1,
        final_price: 1,
        rating: 1,
        discount: { title: 1, amount: 1, type: 1 },
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
        discount: { title: 1, amount: 1, type: 1 },
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
      $project: {
        title: 1,
        base_price: 1,
        final_price: 1,
        discount: { title: 1, amount: 1, type: 1 },
        brand: { _id: 1, name: 1, slug: 1 },
        category: { _id: 1, name: 1, slug: 1 },
        images: { $slice: ["$images", 1] },
        varients: 1,
      },
    },
  ],
};
