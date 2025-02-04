import {Router} from "express"
import {
    addToCart,
    getCart,
    removeFromCart
} from "../controllers/cart.controllers.js"

const router = Router();

router.route("/add-to-cart").post(addToCart)
router.route("/:").get(getCart)
router.route("/remove").post(removeFromCart)

export default router
