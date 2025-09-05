import { Router } from "express";

import { addToWishlist, getAllWishList } from "../controllers/wishList.controllers.js";

const router = Router();

router.post("/create-wishList-order",addToWishlist)

router.get("/get-wishlist", getAllWishList);


export default router;