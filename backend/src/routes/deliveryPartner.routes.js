import { Router } from "express";


import {registerDeliveryPartner,
    deliveryPartnerLogin,
    logoutDeliveryPartner,
    getMyDetails,
    updateMyDetails,
    getAllDeliveryPartner,
    getAvailableDeliveryPartners,
    getRegisteredDeliveryPartners,
    assignOrderToDeliveryPartner,
    getAssignedOrdersForDeliveryPartner,
    updateOrderStatusByDeliveryPartner,
    getEarningsAndDeliveryHistory,
    getCompletedOrdersByDeliveryPartner,
    getDashboardStats,
    getDeliveryReports,
    updateAvailability,
    getDailyCollectionStatus,
    approveDeliveryPartner,
    getOrderStats,
    searchDeliveryPartner,
    getCompletedOrdersByDP,
} from "../controllers/deliveryPartner.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT, verifyJWTAdmin, verifyJWTDelivery } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"pucProof",
            maxCount:1
        },
        {
            name:"licenseProof",
            maxCount:1,
        },
        {
            name:"aadhaarProof",
            maxCount:1,
        },
        {
            name:"panCardProof",
            maxCount:1,
        }
    ]),
    
    registerDeliveryPartner)
router.route("/login").post(deliveryPartnerLogin)
router.route("/logout").post(verifyJWTDelivery,logoutDeliveryPartner)
router.route("/me").get(verifyJWTDelivery,getMyDetails)
router.route("/update").get(verifyJWTDelivery,updateMyDetails)
router.route("/get-all-delivery-partner").get(getAllDeliveryPartner)
router.get("/available", getAvailableDeliveryPartners);
router.get("/registered", getRegisteredDeliveryPartners);
router.post("/assign-order", assignOrderToDeliveryPartner);
router.get("/assigned-orders", verifyJWTDelivery, getAssignedOrdersForDeliveryPartner);
router.put("/order/:orderId/status", verifyJWTDelivery, updateOrderStatusByDeliveryPartner);
router.get("/earnings", verifyJWTDelivery, getEarningsAndDeliveryHistory);
router.get("/completed-orders", verifyJWTDelivery, getCompletedOrdersByDeliveryPartner);
router.get("/dashboard", verifyJWTDelivery, getDashboardStats);
router.get("/reports", verifyJWTDelivery, getDeliveryReports);
router.post("update-availability",updateAvailability)
router.get("/daily-collection", verifyJWTDelivery, getDailyCollectionStatus);
router.post("/approve", approveDeliveryPartner);
router.get("/search", searchDeliveryPartner);
router.get("/completed-by-partner", getCompletedOrdersByDP);
router.get("/daily-stats", getOrderStats)



export default router;