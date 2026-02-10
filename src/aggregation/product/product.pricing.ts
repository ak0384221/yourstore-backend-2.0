export const pricingStages = [
  // 1️⃣ Ensure category is joined first
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  },
  { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

  // 2️⃣ Lookup active discounts using productId and categoryId
  {
    $lookup: {
      from: "discounts",
      let: { productId: "$_id", categoryId: "$category._id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $lte: ["$startDate", "$$NOW"] },
                { $gte: ["$endDate", "$$NOW"] },
              ],
            },
          },
        },
      ],
      as: "activeDiscounts",
    },
  },

  // 3️⃣ Filter applicable discounts
  {
    $addFields: {
      applicableDiscounts: {
        $filter: {
          input: "$activeDiscounts",
          as: "discount",
          cond: {
            $or: [
              { $eq: ["$$discount.applicableTo", "all"] },
              {
                $and: [
                  { $eq: ["$$discount.applicableTo", "category"] },
                  { $in: ["$category._id", "$$discount.categoryIds"] },
                ],
              },
              {
                $and: [
                  { $eq: ["$$discount.applicableTo", "product"] },
                  { $in: ["$_id", "$$discount.productIds"] },
                ],
              },
            ],
          },
        },
      },
    },
  },

  // 4️⃣ Pick first applicable discount
  {
    $addFields: {
      discount: { $arrayElemAt: ["$applicableDiscounts", 0] },
    },
  },

  // 5️⃣ Compute final_price
  {
    $addFields: {
      final_price: {
        $cond: [
          { $ifNull: ["$discount", false] },
          {
            $cond: [
              { $eq: ["$discount.type", "percent"] },
              {
                $subtract: [
                  "$base_price",
                  {
                    $multiply: [
                      "$base_price",
                      { $divide: ["$discount.amount", 100] },
                    ],
                  },
                ],
              },
              { $subtract: ["$base_price", "$discount.amount"] },
            ],
          },
          "$base_price",
        ],
      },
    },
  },
];
