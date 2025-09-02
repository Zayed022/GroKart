import express from "express";
import {
  createFeeConfig,
  getActiveFeeConfig,
  updateFeeConfig,
} from "../controllers/fee.controllers.js";

const router = express.Router();

router.post("/", createFeeConfig);   // ✅ Create new fee config
router.get("/", getActiveFeeConfig); // ✅ Fetch current fee config
router.put("/", updateFeeConfig);    // ✅ Update existing config

export default router;
