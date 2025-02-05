import {Router } from "express"
import {
    createOrder,
    verifyPayment,
    placeOrder,
    getOrderStatus,
    updateOrderStatus,
    assignDeliveryPartner,
    getDeliveryRoute,
    getAssignedOrders
} from "../controllers/order.controllers.js"

const router = Router();

router.route("/create-order").post(createOrder);
router.route("/verify").post(verifyPayment);
router.route("/place-order").post(placeOrder)
router.route("/status").get(getOrderStatus)
router.route("/:orderId/status").put(updateOrderStatus)
router.route("/assign-partner").post(assignDeliveryPartner)
router.route("/get-route").get(getDeliveryRoute)
router.route("/get-assigned-orders").get(getAssignedOrders)
export default router