import { FeeConfig } from "../models/fee.models.js";

// ✅ Create a new FeeConfig (without overriding existing)
export const createFeeConfig = async (req, res) => {
  try {
    const {
      deliveryCharge,
      handlingFee,
      gstPercentage,
      isActive,
      lateNightFee,
      isLateNightActive,
      surgeFee,
      isSurgeActive,
    } = req.body;

    // Check if one already exists (and active)
    const existing = await FeeConfig.findOne({ isActive: true });
    if (existing) {
      return res.status(400).json({
        message: "An active fee configuration already exists. Use update instead.",
      });
    }

    const newFeeConfig = new FeeConfig({
      deliveryCharge,
      handlingFee,
      gstPercentage,
      lateNightFee,
      isLateNightActive,
      surgeFee,
      isSurgeActive,
      isActive: isActive ?? true, // default true
    });

    await newFeeConfig.save();
    res.status(201).json(newFeeConfig);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating fee config", error: error.message });
  }
};

// ✅ Get Active FeeConfig
export const getActiveFeeConfig = async (req, res) => {
  try {
    const feeConfig = await FeeConfig.findOne({ isActive: true });
    if (!feeConfig) {
      return res
        .status(404)
        .json({ message: "Fee configuration not found" });
    }
    res.json(feeConfig);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update existing FeeConfig
export const updateFeeConfig = async (req, res) => {
  try {
    const {
      deliveryCharge,
      handlingFee,
      gstPercentage,
      isActive,
      lateNightFee,
      isLateNightActive,
      surgeFee,
      isSurgeActive,
    } = req.body;

    const updatedConfig = await FeeConfig.findOneAndUpdate(
      { isActive: true },
      {
        deliveryCharge,
        handlingFee,
        gstPercentage,
        isActive,
        lateNightFee,
        isLateNightActive,
        surgeFee,
        isSurgeActive,
      },
      { new: true, upsert: true }
    );

    res.json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
