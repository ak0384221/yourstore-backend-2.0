import { buildProductPipeline } from "../aggregation/product/product.pipeline.ts";
import { pricingStages } from "../aggregation/product/product.pricing.ts";
import { relationStages } from "../aggregation/product/product.relations.ts";
import { viewProjections } from "../aggregation/product/product.views.ts";
import { Product } from "../models/Product.model.ts";

// export const getProductsService = async ({
//   filters,
//   skip,
//   limit,
//   searchQuery,
// }: {
//   filters: any;
//   skip: number;
//   limit: number;
//   searchQuery?: string;
// }) => {
//   const basePipeline = buildProductPipeline({
//     source: "PRODUCT",
//     view: "LIST",
//     match: filters,
//     skip,
//     limit,
//     searchQuery,
//   });

//   const result = await Product.aggregate([
//     {
//       $facet: {
//         data: basePipeline,
//         count: [
//           ...buildProductPipeline({
//             source: "PRODUCT",
//             view: "LIST",
//             match: filters,
//             searchQuery,
//           }),
//           { $count: "total" },
//         ],
//       },
//     },
//   ]);

//   return {
//     products: result[0].data,
//     total: result[0].count[0]?.total || 0,
//   };
// };

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
  // 1️⃣ Build the initial match/search stage
  const pipeline: any[] = [];

  // If using Atlas Search
  if (searchQuery) {
    pipeline.push({
      $search: {
        index: "default", // your search index name
        text: {
          query: searchQuery,
          path: ["title", "description"], // fields to search
        },
      },
    });
  }

  // Additional filters after search
  if (filters && Object.keys(filters).length > 0) {
    pipeline.push({ $match: filters });
  }

  // 2️⃣ Use $facet on the filtered results
  pipeline.push({
    $facet: {
      data: [
        ...pricingStages, // heavy stages
        ...relationStages({ includeReturnPolicy: false }), // lookups
        ...viewProjections["LIST"], // projections
        { $skip: skip },
        { $limit: limit },
      ],
      count: [
        { $count: "total" }, // counts documents AFTER $search + filters
      ],
    },
  });

  const result = await Product.aggregate(pipeline);

  return {
    products: result[0]?.data || [],
    total: result[0]?.count[0]?.total || 0,
  };
};
