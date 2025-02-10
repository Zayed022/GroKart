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
    getProductsByMiniCategory} from "../controllers/product.controllers.js";

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
router.route("/get-products-by-id").get(getProductById)
router.route("/update-products").get(updateProductDetails)
router.route("/delete-product").delete(deleteProduct)
router.route("/:").get(getProducts)
router.route("/category/:category").get(getProductsByCategory)
router.route("/subCategory/:").get(getProductsBySubCatgeory)
router.route("/minicategory/:").get(getProductsByMiniCategory)

export default router