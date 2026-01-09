import mongoose from "mongoose";

const DiscountSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    }, // e.g., "Winter Sale"

    amount: {
      type: Number,
      required: true,
    },

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
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Discount = mongoose.model("Discount", DiscountSchema);
