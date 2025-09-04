import express from "express";
import { getSettings, updateSettings } from "../controllers/setting.controllers.js"

const router = express.Router();

// Public - Get COD availability
router.get("/", getSettings);

// Admin - Update COD availability
router.put("/", updateSettings);

export default router;
