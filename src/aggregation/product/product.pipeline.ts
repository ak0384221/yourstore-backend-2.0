import { baseStages } from "./product.base.ts";
import { pricingStages } from "./product.pricing.ts";
import { relationStages } from "./product.relations.ts";
import { viewProjections } from "./product.views.ts";
import { cartShapeStages } from "../cart/cart.shape.ts";

export const buildProductPipeline = ({
  source = "PRODUCT",
  match = {},
  view,
  skip = 0,
  limit = 10,
  searchQuery,
}: {
  source?: "PRODUCT" | "CART";
  match?: any;
  view: "LIST" | "DETAIL" | "CART";
  skip?: number;
  limit?: number;
  searchQuery?: string;
}) => {
  const pipeline: any[] = [];

  // 0️⃣ Cart adapter (ONLY if source = CART)
  if (source === "CART") {
    pipeline.push(...cartShapeStages);
  }

  // 1️⃣ Base
  pipeline.push(...baseStages({ filters: match, searchQuery }));

  // 2️⃣ Pricing
  pipeline.push(...pricingStages);

  // 3️⃣ Relations
  pipeline.push(
    ...relationStages({
      includeReturnPolicy: view === "DETAIL",
    })
  );

  // 4️⃣ View projection
  pipeline.push(...viewProjections[view]);

  // 5️⃣ Pagination
  if (view === "LIST") {
    pipeline.push({ $skip: skip }, { $limit: limit });
  }

  return pipeline;
};
