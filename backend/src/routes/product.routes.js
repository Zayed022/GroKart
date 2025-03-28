import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addProduct, 
    deleteProduct, 
    getAllProducts, 
    getProductsByCategory, 
    getProductById, 
    getProducts, 
    updateProductDetails, 
    getProductsBySubCatgeory,
    getProductsByMiniCategory,
    getAllCategories,
    getAllSubCategories,
    getAllMiniCategories,
    getCategoriesWithSubCategories} from "../controllers/product.controllers.js";

const router = Router()

router.route("/add-product").post(
    upload.fields([
        {
            name:"image",
            maxCount:1
        }
    ]),
    addProduct
)

router.route("/get-product").get(getAllProducts)
router.route("/:productId").get(getProductById)
router.route("/update-products").get(updateProductDetails)
router.route("/delete-product").delete(deleteProduct)
router.route("/").get(getProducts)
router.route("/category/:category").get(getProductsByCategory)
router.route("/subCategory/:subCategory").get(getProductsBySubCatgeory)
router.route("/minicategory/:").get(getProductsByMiniCategory)
router.route("/get-all-categories").get(getAllCategories)
router.route("/get-all-sub-categories").get(getAllSubCategories)
router.route("/get-all-mini-categories").get(getAllMiniCategories)
router.route("/get-categories-with-subcategories").get(getCategoriesWithSubCategories)

export default router