import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  codEnabled: { type: Boolean, default: true }
});

export const Settings = mongoose.model("Settings", settingsSchema);
