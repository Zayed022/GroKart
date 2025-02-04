import { Router } from "express";


import {registerDeliveryPartner,
    deliveryPartnerLogin,
    logoutDeliveryPartner
} from "../controllers/deliveryPartner.controllers.js"

const router = Router();

router.route("/register-delivery-partner").post(registerDeliveryPartner)
router.route("/login-delivery-partner").post(deliveryPartnerLogin)
router.route("/logout-delivery-partner").post(logoutDeliveryPartner)

export default router;