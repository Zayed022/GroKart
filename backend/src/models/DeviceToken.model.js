// backend/src/models/DeviceToken.js
import mongoose from "mongoose";

const deviceTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    token: { type: String, required: true, unique: true, index: true },
    platform: { type: String, enum: ['android', 'ios', 'web'], default: 'android' },
    lastSeenAt: { type: Date, default: Date.now },
    meta: { type: Object }, // e.g., app version, brand, model
  },
  { timestamps: true }
);

export const DeviceToken = mongoose.model('DeviceToken', deviceTokenSchema);


