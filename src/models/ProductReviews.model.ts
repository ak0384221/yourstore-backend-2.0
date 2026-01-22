import mongoose from "mongoose";
import { Product } from "./Product.model.ts";
import { User } from "./User.model.ts";

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

    isVerifiedPurchase: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model("Review", ReviewSchema);
