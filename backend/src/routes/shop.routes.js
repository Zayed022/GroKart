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
  getCompletedOrdersByShops,
  updateProductAvailability,
  getRegisteredShops,
  approveShop,
  getAllShop,
  searchShop,
  getShopEarningsAndOrderHistory,
  getCompletedOrdersByShop,
  getCompletedOrdersByShopForAdmin,
  getShopDailyEarnings
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
router.put(
  '/:orderId/product-availability',
  verifyJWTShop, // Ensure shop is authenticated
  updateProductAvailability
);

router.get("/registered", getRegisteredShops);
router.post("/approve", approveShop);
router.get("/get-all-shops",getAllShop)
router.get("/daily-earnings/:shopId", getShopDailyEarnings);
router.get("/search",searchShop)
router.get("/earnings", verifyJWTShop, getShopEarningsAndOrderHistory);
router.get("/completed-orders", verifyJWTShop, getCompletedOrdersByShop);
router.get("/completed-by-shop", getCompletedOrdersByShopForAdmin);
export default router;
