import mongoose from "mongoose";
import { Brand } from "./Brand.model.ts";
import { Category } from "./Category.model.ts";
import { Discount } from "./Discount.model.ts";

const ImageSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
});

const VarientSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true },
});

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 6,
  },

  description: {
    type: String,
    required: true,
    min: 20,
  },

  base_price: {
    type: Number,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    default: 0,
  },

  images: [ImageSchema],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand,
    required: true,
  },
  varients: [VarientSchema],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Category,
    required: true,
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Discount,
    default: null,
  },
});

export const Product = mongoose.model("Product", ProductSchema);
