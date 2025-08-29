import {Router} from "express"

import { addBanner, deleteBanner, getActiveBanners, updateBanner } from "../controllers/mobileBanner.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

router.route("/add-banner").post(
    upload.fields([
        {
            name:"image",
            maxCount:1
        }
    ]),
    addBanner
)

router.get("/active", getActiveBanners);
router.put("/:id", updateBanner);
router.delete("/:id", deleteBanner);

export default router;