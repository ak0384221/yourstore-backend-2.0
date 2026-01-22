import mongoose from "mongoose";

const ReturnPolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    policy: {
      type: String,
      required: true,
    },

    returnInDays: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ReturnPolicy = mongoose.model("ReturnPolicy", ReturnPolicySchema);
