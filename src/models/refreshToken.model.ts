import mongoose from "mongoose";

const authSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Used to immediately invalidate a session
    isRevoked: {
      type: Boolean,
      default: false,
    },

    // Absolute expiry (e.g. 7 days, 30 days)
    expiresAt: {
      type: Date,
      required: true,
    },

    // Security & observability
    userAgent: {
      type: String,
    },

    ip: {
      type: String,
    },

    deviceName: {
      type: String, // e.g. "Chrome on Windows", "iPhone 14"
    },
  },
  {
    timestamps: true, // createdAt = login time
  }
);

// Automatically delete expired sessions (MongoDB TTL)
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const AuthSession = mongoose.model("AuthSession", authSessionSchema);
