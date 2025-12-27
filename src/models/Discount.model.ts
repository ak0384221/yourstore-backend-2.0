import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }, // e.g., "Winter Sale"
  amount: {
    type: Number,
    required: true,
  }, // discount value
  type: {
    type: String,
    enum: ["percent", "flat"],
    default: "flat",
  },
  applicableTo: {
    type: String,
    enum: ["product", "category", "all"], // scope of discount
    default: "all",
  },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // optional
  categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // optional
  startDate: { type: Date },
  endDate: { type: Date },
});

export const Discount = mongoose.model("Discount", discountSchema);
