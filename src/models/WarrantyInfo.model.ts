import mongoose from "mongoose";

const WarrantyPolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    coverage: {
      type: String,
      required: true,
    },

    durationInMonths: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      enum: ["brand", "seller"],
    },
  },
  {
    timestamps: true,
  }
);

export const WarrantyPolicy = mongoose.model(
  "WarrantyPolicy",
  WarrantyPolicySchema
);
