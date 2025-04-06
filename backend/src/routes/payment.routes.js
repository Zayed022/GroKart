import {Router } from "express"
import { createNewOrder,
    markCodOrder,
    verifyPayment
 } from "../controllers/payment.controllers.js"

 const router = Router();

 router.route("/create-order").post(createNewOrder);
 router.route("/mark-cod").post(markCodOrder);
 router.route("/verify").post(verifyPayment)

 export default router;