import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
});

export const User = mongoose.model("User", UserSchema);
