import {Router} from "express"
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
    getAllProducts
} from "../controllers/admin.controllers.js"
import { isAdminTrue } from "../middlewares/admin.middlewares.js";


import { verifyJWT, verifyJWTAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register-admin").post(registerAdmin)
router.route("/login-admin").post(adminLogin)
router.route("/logout").post(verifyJWTAdmin,logoutAdmin)
router.route("get-all-admin").get(getAllAdmin)
router.post("/search", searchOrders);
router.post("/filter-orders", filterOrders);
router.post("/export-orders", exportOrders);
router.get("/daily-collection", getDailyCollectionByDeliveryPartners);
router.get("/daily-earnings", getDailyEarningsByDeliveryPartners);
router.get("/all-time-earnings", getAllTimeEarningsByDeliveryPartners);
router.get("/delivered-orders", getAllDeliveredOrdersWithTimestamps);
router.get("/report", getDeliveryReports);
router.get("/get-orders", getAllOrders);
router.get("/get-products", getAllProducts);






export default router
