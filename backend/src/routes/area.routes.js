import express from "express";
import {
  createArea,
  getAllAreas,
  getAreaByPincode,
  updateArea,
  deleteArea
} from "../controllers/area.controllers.js";

const router = express.Router();

// POST - create new area
router.post("/", createArea);

// GET - all areas
router.get("/", getAllAreas);

// GET - single area by pincode
router.get("/:pincode", getAreaByPincode);

// PUT - update area by ID
router.put("/:id", updateArea);

// DELETE - delete area by ID
router.delete("/:id", deleteArea);

export default router;
