import mongoose from "mongoose";
import { User } from "./User.model";
import { Product } from "./Product.model";

const OrderItemsSchema = new mongoose.Schema({
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  base_price: {
    type: Number,
    required: true,
  },
  discount_rate: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  finalAmount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
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
    items: [OrderItemsSchema],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
