import mongoose from "mongoose";
import { Product } from "./Product.model.ts";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product,
      required: true,
    },
    selectedSize: {
      type: String,
      required: true,
    },
    selectedColor: {
      type: String,
      required: true,
    },
    selectedQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

CartSchema.index(
  { user: 1, product: 1, selectedSize: 1, selectedColor: 1 },
  { unique: true }
);

export const Cart = mongoose.model("Cart", CartSchema);
