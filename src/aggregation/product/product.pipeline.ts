import { baseStages } from "./product.base.ts";
import { pricingStages } from "./product.pricing.ts";
import { relationStages } from "./product.relations.ts";
import { viewProjections } from "./product.views.ts";

export const buildProductPipeline = ({
  match = {},
  view,
  skip = 0,
  limit = 10,
  searchQuery,
}: {
  match?: any;
  view: "LIST" | "DETAIL" | "CART";
  skip?: number;
  limit?: number;
  searchQuery?: string;
}) => {
  const pipeline: any[] = [];

  // 1️⃣ Base
  pipeline.push(...baseStages({ filters: match, searchQuery, skip, limit }));

  // 2️⃣ Pricing
  pipeline.push(...pricingStages);

  // 3️⃣ Relations
  pipeline.push(...relationStages({ includeReturnPolicy: view === "DETAIL" }));

  // 4️⃣ View projection
  pipeline.push(...viewProjections[view]);

  // 5️⃣ Pagination (only for LIST)
  if (view === "LIST") {
    pipeline.push({ $skip: skip }, { $limit: limit });
  }

  return pipeline;
};
