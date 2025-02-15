import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addCategoryWithSubCategory, getAllCategories } from "../controllers/category.controllers.js";

const router = Router();

router.route("/add-category").post(
    upload.fields([
        {
            name:"image",
            maxCount:1
        }
    ]),
    addCategoryWithSubCategory
)
router.route("/get-all-categories").get(getAllCategories)

export default router