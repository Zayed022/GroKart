import {Router} from "express"
import { createOffer,
    getAllOffers,
    applyCouponCode
 } from "../controllers/offer.controllers.js"


 const router = Router();

 router.route("/create").post(createOffer);
 router.route("/get-all-offers").get(getAllOffers);
 router.route("/apply-coupon-code").post(applyCouponCode);

 export default router