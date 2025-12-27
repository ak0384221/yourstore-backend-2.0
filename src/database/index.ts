import mongoose from "mongoose";

async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI!);
    console.log("database connected");
  } catch (error) {
    console.log("database connection failed", error);
  }
}

export { connectDB };
