import { Router } from "express";
import {
  adminLogin,
  registerAdmin,
  logoutAdmin,
  getAllAdmin,
  searchOrders,
  filterOrders,
  exportOrders,
  getDailyCollectionByDeliveryPartners,
  getDailyEarningsByDeliveryPartners,
  getAllTimeEarningsByDeliveryPartners,
  getAllDeliveredOrdersWithTimestamps,
  getDeliveryReports,
  getAllOrders,
  getAllProducts,
  updatePaymentStatusByAdmin,
  getSales,
} from "../controllers/admin.controllers.js";

import { verifyJWTAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

// 🔓 Public routes
router.post("/register-admin", registerAdmin);
router.post("/login-admin", adminLogin);

// 🔐 Protected routes
router.post("/logout", verifyJWTAdmin, logoutAdmin);
router.get("/get-all-admin", verifyJWTAdmin, getAllAdmin);
router.post("/search", verifyJWTAdmin, searchOrders);
router.post("/filter-orders", verifyJWTAdmin, filterOrders);
router.post("/export-orders", verifyJWTAdmin, exportOrders);
router.get("/daily-collection", verifyJWTAdmin, getDailyCollectionByDeliveryPartners);
router.get("/daily-earnings", verifyJWTAdmin, getDailyEarningsByDeliveryPartners);
router.get("/all-time-earnings", verifyJWTAdmin, getAllTimeEarningsByDeliveryPartners);
router.get("/delivered-orders", verifyJWTAdmin, getAllDeliveredOrdersWithTimestamps);
router.get("/report", verifyJWTAdmin, getDeliveryReports);
router.get("/get-orders", verifyJWTAdmin, getAllOrders);
router.get("/get-products", verifyJWTAdmin, getAllProducts);
router.patch("/update-payment-status", verifyJWTAdmin, updatePaymentStatusByAdmin);
router.get("/get-sales", verifyJWTAdmin, getSales);

export default router;
