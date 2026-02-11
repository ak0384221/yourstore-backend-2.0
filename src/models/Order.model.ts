import mongoose from "mongoose";
import { User } from "./User.model";
import { Product } from "./Product.model";
import { Discount } from "./Discount.model";

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },

  // 🔒 SNAPSHOT — source of truth
  productTitle: { type: String, required: true },

  brand: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    name: String,
    slug: String,
  },

  category: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    name: String,
    slug: String,
  },

  base_price: { type: Number, required: true },
  final_price: { type: Number, required: true },

  discount: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
    },
    title: String,
    type: String,
    amount: Number,
  },

  color: String,
  size: String,
  quantity: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    status: {
      type: String,
      enum: ["placed", "confirmed", "delivered"],
      default: "placed",
    },
    payment_method: {
      type: String,
      enum: ["Cash On Delivery", "Bkash", "Rocket"],
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
    },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }, // NEW
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
