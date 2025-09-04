import { Settings } from "../models/setting.models.js";


export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.status(200).json({ codEnabled: settings.codEnabled });
  } catch (error) {
    res.status(500).json({ message: "Error fetching settings", error: error.message });
  }
};

//  Update COD availability (admin use)
export const updateSettings = async (req, res) => {
  try {
    const { codEnabled } = req.body;
    const settings = await Settings.findOneAndUpdate(
      {},
      { codEnabled },
      { new: true, upsert: true } // create if not exists
    );
    res.status(200).json({ message: "Settings updated", codEnabled: settings.codEnabled });
  } catch (error) {
    res.status(500).json({ message: "Error updating settings", error: error.message });
  }
};

//  Initialize default settings (optional, call once on app startup)
export const initSettings = async () => {
  const existing = await Settings.findOne();
  if (!existing) {
    await Settings.create({ codEnabled: true });
    console.log("Default settings created");
  }
};
