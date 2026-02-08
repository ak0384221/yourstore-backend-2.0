import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      immutable: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
    },
  },
  { timestamps: true }
);

//array func doesnt have this context thats why it needs function key declaration
//hashing pass
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
export { UserSchema };
export const User = mongoose.model("User", UserSchema);
