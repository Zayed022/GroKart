import mongoose, { Schema } from "mongoose";

const feeConfigSchema = new Schema(
  {
    deliveryCharge: {
      type: Number,
      required: true,
      default: 20,
    },
    handlingFee: {
      type: Number,
      required: true,
      default: 5,
    },
    gstPercentage: {
      type: Number,
      required: true,
      default: 0,
    },

    // 🔹 New optional fees
    lateNightFee: {
      type: Number,
      default: 10,
    },
    isLateNightActive: {
      type: Boolean,
      default: false,
    },

    surgeFee: {
      type: Number,
      default: 0,
    },
    isSurgeActive: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const FeeConfig = mongoose.model("FeeConfig", feeConfigSchema);
