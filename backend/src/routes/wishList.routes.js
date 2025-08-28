import { Router } from "express";

import { addToWishlist } from "../controllers/wishList.controllers.js";

const router = Router();

router.post("/create-wishList-order",addToWishlist)


export default router;