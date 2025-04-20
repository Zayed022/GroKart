import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addCategoryWithSubCategory, getAllCategories, getMiniCategoriesBySubcategory } from "../controllers/category.controllers.js";

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
router.get("/category/:categoryName/subcategory/:subcategoryName/minicategories", getMiniCategoriesBySubcategory);


export default router