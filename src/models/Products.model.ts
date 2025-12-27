import mongoose from "mongoose";
import { ref } from "node:process";
import { Brand } from "./Brand.model";
import { Category } from "./Category.model";
import { Discount } from "./Discount.model";

const imageSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, required: true },
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

  price: {
    type: Number,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    default: 0,
  },

  images: [imageSchema],
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Brand,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Category,
  },
  discount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Discount,
    default: null,
  },
});

export const Product = mongoose.model("Product", ProductSchema);
