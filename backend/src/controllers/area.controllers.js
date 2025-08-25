import { Area } from "../models/area.model.js";

// ✅ Create a new Area
export const createArea = async (req, res) => {
  try {
    const { name, pincode, city, state, isServiceAvailable } = req.body;

    // Check if area already exists with same pincode
    const existingArea = await Area.findOne({ name });
    if (existingArea) {
      return res.status(400).json({ message: "Area with this pincode already exists" });
    }

    const area = await Area.create({
      name,
      pincode,
      city,
      state,
      isServiceAvailable
    });

    res.status(201).json({ message: "Area created successfully", area });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all areas
export const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.status(200).json(areas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get area by pincode
export const getAreaByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    const area = await Area.findOne({ pincode });
    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }
    res.status(200).json(area);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update area
export const updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await Area.findByIdAndUpdate(id, req.body, { new: true });
    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }
    res.status(200).json({ message: "Area updated successfully", area });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete area
export const deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await Area.findByIdAndDelete(id);
    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }
    res.status(200).json({ message: "Area deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
