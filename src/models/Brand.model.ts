import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export const Brand = mongoose.model("Brand", BrandSchema);
