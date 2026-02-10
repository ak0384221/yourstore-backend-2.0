import { buildProductPipeline } from "../aggregation/product/product.pipeline.ts";
import { Cart } from "../models/Cart.model.ts";

export const getCartService = async (userId: string) => {
  const basePipeline = buildProductPipeline({
    source: "CART",
    view: "CART",
    match: { userId },
  });

  const result = await Cart.aggregate([
    {
      $facet: {
        data: basePipeline,
        count: [
          ...basePipeline,
          {
            $project: {
              total: { $size: "$items" }, // number of items in the cart
            },
          },
        ],
      },
    },
  ]);

  return {
    cart: result[0].data[0] || null,
    totalItems: result[0].count[0]?.total || 0,
  };
};
