import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    payment_gateway: { type: String, required: true }, // e.g., Stripe, Bkash
    gateway_transaction_id: { type: String }, // ID from the payment provider
    amount: { type: Number, required: true },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", TransactionSchema);
