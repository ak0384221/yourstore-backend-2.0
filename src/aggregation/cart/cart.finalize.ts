// export const cartFinalizeStages = [
//   {
//     $addFields: {
//       item_total: {
//         $multiply: ["$quantity", "$final_price"],
//       },
//     },
//   },
//   {
//     $group: {
//       _id: "$userId",
//       items: {
//         $push: {
//           productId: "$_productId",
//           title: "$title",
//           images: "$images",
//           brand: "$brand",
//           category: "$category",
//           price: "$final_price",
//           base_price: "$base_price",
//           quantity: "$quantity",
//           selectedSize: "$selectedSize",
//           selectedColor: "$selectedColor",
//           item_total: "$item_total",
//         },
//       },
//       cart_total: { $sum: "$item_total" },
//     },
//   },
// ];

//not needed for now.fixed it in the product.pipeline
