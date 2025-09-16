import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addCategoryWithSubCategory, createCategory, getAllCategories, getAllMiniCategories, getAllSubcategories, getMiniCategoriesBySubcategory, updateCategoryImage } from "../controllers/category.controllers.js";

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

router.route("/create").post(
    upload.fields([
        {
            name:"image",
            maxCount:1
        }
    ]),
    createCategory
)

router.get("/subcategories", getAllSubcategories);
router.get("/minicategories", getAllMiniCategories);

router.put("/:id/image", upload.fields([{ name: "image", maxCount: 1 }]), updateCategoryImage);



export default router