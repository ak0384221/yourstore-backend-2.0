import mongoose from "mongoose";
import { Product } from "./Product.model.ts";

const CartItemSchema = new mongoose.Schema({
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
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", CartSchema);
