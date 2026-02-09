export const pricingStages = [
  {
    $lookup: {
      from: "discounts",
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
                  { $in: ["$category", "$$discount.categoryIds"] },
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
  { $addFields: { discount: { $arrayElemAt: ["$applicableDiscounts", 0] } } },
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
