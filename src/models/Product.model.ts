import mongoose from "mongoose";
import { Brand } from "./Brand.model.ts";
import { Category } from "./Category.model.ts";
import { Discount } from "./Discount.model.ts";
import { ReturnPolicy } from "./ReturnPolicy.model.ts";
import { WarrantyPolicy } from "./WarrantyInfo.model.ts";

const ImageSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: {
    type: String,
    default: function (this: any) {
      // 'this' is the subdocument; we can access parentDocument
      return this?.ownerDocument?.().title || "default title";
    },
  },
});

const VarientSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true },
});

const DimensionSchema = new mongoose.Schema({
  width: { type: String, required: true },
  height: { type: String, required: true },
  depth: { type: Number, required: true },
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

  images: { type: [ImageSchema], required: true },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",

    default: null,
  },
  varients: {
    type: [VarientSchema],
    required: true,
  },
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
  dimensions: {
    type: [DimensionSchema],
    default: null,
  },
  return_policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ReturnPolicy,
    default: null,
  },
  warranty_info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: WarrantyPolicy,
    default: null,
  },
});

export const Product = mongoose.model("Product", ProductSchema);
