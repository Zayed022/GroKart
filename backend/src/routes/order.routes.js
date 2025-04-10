import {Router } from "express"
import {
    createOrder,
    verifyPayment,
    placeOrder,
    getOrderStatus,
    updateOrderStatus,
    assignDeliveryPartner,
    getDeliveryRoute,
    getAssignedOrders,
    
} from "../controllers/order.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

//router.route("/create-order").post(createOrder);
router.post("/create-order",createOrder)
router.route("/verify").post(verifyPayment);
router.route("/place-order").post(placeOrder)
router.route("/status").get(getOrderStatus)
router.route("/:orderId/status").put(updateOrderStatus)
router.route("/assign-partner").post(assignDeliveryPartner)
router.route("/get-route").get(getDeliveryRoute)
router.route("/get-assigned-orders").get(getAssignedOrders)

export default router