import { buildProductPipeline } from "../aggregation/product/product.pipeline.ts";
import { Product } from "../models/Product.model.ts";

export const getProductsService = async ({
  filters,
  skip,
  limit,
  searchQuery,
}: {
  filters: any;
  skip: number;
  limit: number;
  searchQuery?: string;
}) => {
  const basePipeline = buildProductPipeline({
    source: "PRODUCT",
    view: "LIST",
    match: filters,
    skip,
    limit,
    searchQuery,
  });

  const result = await Product.aggregate([
    {
      $facet: {
        data: basePipeline,
        count: [
          ...buildProductPipeline({
            source: "PRODUCT",
            view: "LIST",
            match: filters,
            searchQuery,
          }),
          { $count: "total" },
        ],
      },
    },
  ]);

  return {
    products: result[0].data,
    total: result[0].count[0]?.total || 0,
  };
};
