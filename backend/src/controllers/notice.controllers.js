import { Notice } from "../models/notice.models.js";

// Get active notice
export const getActiveNotice = async (req, res) => {
  try {
    const notice = await Notice.findOne({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(notice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notice", error });
  }
};

// Add notice
export const addNotice = async (req, res) => {
  try {
    const { title, message, icon, backgroundColor, textColor, isActive } = req.body;
    const notice = new Notice({ title, message, icon, backgroundColor, textColor, isActive });
    await notice.save();
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: "Error adding notice", error });
  }
};

// Update notice
export const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByIdAndUpdate(id, req.body, { new: true });
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.status(200).json(notice);
  } catch (error) {
    res.status(400).json({ message: "Error updating notice", error });
  }
};

// Delete notice
export const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findByIdAndDelete(id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.status(200).json({ message: "Notice deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting notice", error });
  }
};
