import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Area name is required"],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
    match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"]
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true
  },
  state: {
    type: String,
    required: [true, "State is required"],
    trim: true
  },
  isServiceAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const Area = mongoose.model("Area", areaSchema);
