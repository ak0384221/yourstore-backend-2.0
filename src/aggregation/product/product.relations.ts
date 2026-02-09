export const relationStages = ({ includeReturnPolicy = false } = {}) => {
  const stages: any[] = [
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "brands",
        localField: "brand",
        foreignField: "_id",
        as: "brand",
      },
    },
    { $unwind: { path: "$brand", preserveNullAndEmptyArrays: true } },
  ];

  if (includeReturnPolicy) {
    stages.push(
      {
        $lookup: {
          from: "returnpolicies",
          localField: "return_policy",
          foreignField: "_id",
          as: "return_policy",
        },
      },
      { $unwind: { path: "$return_policy", preserveNullAndEmptyArrays: true } }
    );
  }

  return stages;
};
