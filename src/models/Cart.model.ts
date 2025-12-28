import mongoose from "mongoose";
import { Product } from "./Product.model";

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    Items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", CartSchema);
