// src/routes/aiAgent.routes.js
import express from "express";
import { chat } from "../controllers/aiAgent.controller.js";
import {  verifyJWT } from "../middlewares/auth.middlewares.js";
import { recommendProducts } from "../controllers/aiRecommendation.controllers.js";

const router = express.Router();

// Only logged-in users can use AI agent
router.post("/chat", chat);

router.post("/recommend", recommendProducts);
export default router;
