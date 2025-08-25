import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { addProduct, 
    deleteProduct, 
    getAllProducts, 
    getProductsByCategory, 
    getProductById, 
    getProducts, 
    updateProductDetails, 
    getProductsByMiniCategory,
    getAllCategories,
    getAllSubCategories,
    getAllMiniCategories,
    getCategoriesWithSubCategories,
    getProductsAll,

    updateStock,
    resetAllStock,
    setStockToEightIfZeroOrLess,
    getProductsBySubCategory,
    getHomePageProducts,
    setStockZeroBySubCategory,
    updateProductPrice,
    updateProductDescription,
    updateProductImage} from "../controllers/product.controllers.js";
import { verifyJWTAdmin } from "../middlewares/auth.middlewares.js";

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
router.route("/products/:id").put(updateProductDetails)
router.route("/delete-product").delete(deleteProduct)
router.route("/").get(getProducts)
router.route("/category/:category").get(getProductsByCategory)
router.route("/subCategory/:subCategory").get(getProductsBySubCategory)
router.route("/minicategory/:").get(getProductsByMiniCategory)
router.route("/get-all-categories").get(getAllCategories)
router.route("/get-all-sub-categories").get(getAllSubCategories)
router.get('/minicategory/:miniCategory', getProductsByMiniCategory)
router.route("/get-categories-with-subcategories").get(getCategoriesWithSubCategories)
router.route("/get-all-products").get(getProductsAll)
router.put("/stock", updateStock);
router.put("/reset-stock", resetAllStock);
router.put("/set-stock-to-eight", setStockToEightIfZeroOrLess);
router.get("/home-page-products",getHomePageProducts)
router.put("/zero-stock/:subCategory", setStockZeroBySubCategory);
router.put("/update-price", updateProductPrice);
router.put("/update-description", updateProductDescription);
router.put(
  "/update-image",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateProductImage
);

export default router