import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

export const Cart = mongoose.model("Cart", CartSchema);
