import {Router } from "express"
import {
    //createOrder,
    verifyPayment,
    placeOrder,
    getOrderStatus,
    updateOrderStatus,
    assignDeliveryPartner,
    getDeliveryRoute,
    getAssignedOrders,
    handleCODPayment,
    getMyOrders,
    createOrderUsingCashfree,
    getAllOrders,
    getOrderById,
    generateInvoice,
    cancelOrderByAdmin,
    getRecentOrdersByCustomer,
    getOrdersByStatus,
    getPlacedOrders,
    
} from "../controllers/order.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { updatePaymentStatusByDeliveryPartner } from "../controllers/deliveryPartner.controllers.js";

const router = Router();

//router.route("/create-order").post(createOrder);
//router.post("/create-order", verifyJWT, createOrder)
router.post("/create-cod-order",handleCODPayment)
router.route("/verify").post(verifyPayment);
router.route("/place-order").post(placeOrder)
router.route("/status").get(getOrderStatus)
router.get("/orders-status", getOrdersByStatus); 
router.get("/placed", getPlacedOrders);
router.route("/:orderId/status").put(updateOrderStatus)
router.route("/:orderId/payment-status").put(updatePaymentStatusByDeliveryPartner)
router.route("/assign-partner").post(assignDeliveryPartner)
router.route("/get-route").get(getDeliveryRoute)
router.route("/get-assigned-orders").get(getAssignedOrders)
router.get("/my-orders",verifyJWT,getMyOrders)
router.post('/create-order-cashfree',verifyJWT,createOrderUsingCashfree)
router.get("/get", getAllOrders)
router.get("/recent-orders", verifyJWT, getRecentOrdersByCustomer);
router.get("/:orderId", getOrderById);
router.get("/order/:id/invoice", verifyJWT, generateInvoice);
router.post("/cancel", cancelOrderByAdmin);





export default router