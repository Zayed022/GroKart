import express from "express";
import {
  registerShop,
  loginShop,
  logoutShop,
  getMyDetails,
  getAllShops,
  assignOrderToShop,
  getAssignedOrdersForShops,
  updateOrderStatusByShop,
  getCompletedOrdersByShops
} from "../controllers/shop.controllers.js";
import { verifyJWTShop } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/register", registerShop);
router.post("/login", loginShop);
router.post("/logout",verifyJWTShop,logoutShop)
router.get("/me",verifyJWTShop,getMyDetails)
router.get("/all-shops",getAllShops)
router.post("/assign-order",assignOrderToShop)
router.get("/get-assigned-orders",verifyJWTShop,getAssignedOrdersForShops)
router.put("/:orderId/status",verifyJWTShop, updateOrderStatusByShop)
router.get("/served-orders",verifyJWTShop,getCompletedOrdersByShops)
export default router;
