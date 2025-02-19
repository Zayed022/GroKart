import {Router} from "express"
import {
    addToCart,
    getCart,
    removeFromCart
} from "../controllers/cart.controllers.js"

const router = Router();

router.route("/add/:userId/:productId/:quantity").post(addToCart)
router.route("/get-cart/:userId").get(getCart)
router.route("/remove/:userId/:productId").post(removeFromCart) 

export default router
