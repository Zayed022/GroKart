import { Router } from "express";


import {registerDeliveryPartner,
    deliveryPartnerLogin,
    logoutDeliveryPartner,
    getMyDetails,
    updateMyDetails,
    getAllDeliveryPartner,
    getAvailableDeliveryPartners,
    assignOrderToDeliveryPartner,
    getAssignedOrdersForDeliveryPartner,
    updateOrderStatusByDeliveryPartner,
    getEarningsAndDeliveryHistory,
    getCompletedOrdersByDeliveryPartner,
    getDashboardStats,
    getDeliveryReports,
    updateAvailability,
} from "../controllers/deliveryPartner.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT, verifyJWTDelivery } from "../middlewares/auth.middlewares.js";

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
router.post("/assign-order", assignOrderToDeliveryPartner);
router.get("/assigned-orders", verifyJWTDelivery, getAssignedOrdersForDeliveryPartner);
router.put("/order/:orderId/status", verifyJWTDelivery, updateOrderStatusByDeliveryPartner);
router.get("/earnings", verifyJWTDelivery, getEarningsAndDeliveryHistory);
router.get("/completed-orders", verifyJWTDelivery, getCompletedOrdersByDeliveryPartner);
router.get("/dashboard", verifyJWTDelivery, getDashboardStats);
router.get("/reports", verifyJWTDelivery, getDeliveryReports);
router.post("update-availability",updateAvailability)



export default router;