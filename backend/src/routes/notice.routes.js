import express from "express";
import {
  getActiveNotice,
  addNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/notice.controllers.js";

const router = express.Router();

router.get("/active", getActiveNotice);
router.post("/add", addNotice);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

export default router;
