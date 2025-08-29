import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    icon: {
      type: String, // optional: "traffic", "rain", "alert" (frontend can decide icon)
    },
    backgroundColor: {
      type: String,
      default: "#FEE2E2",
    },
    textColor: {
      type: String,
      default: "#991B1B",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Notice = mongoose.model("Notice", noticeSchema);
