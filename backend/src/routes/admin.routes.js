import {Router} from "express"
import {
    adminLogin,
    registerAdmin,
    logoutAdmin,
    getAllAdmin,
    searchOrders,
    filterOrders,
    exportOrders
} from "../controllers/admin.controllers.js"
import { isAdminTrue } from "../middlewares/admin.middlewares.js";


import { verifyJWT, verifyJWTAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register-admin").post(registerAdmin)
router.route("/login-admin").post(adminLogin)
router.route("/logout").post(verifyJWTAdmin,logoutAdmin)
router.route("get-all-admin").get(getAllAdmin)
router.post("/search", searchOrders);
router.post("/filter-orders", filterOrders);
router.post("/export-orders", exportOrders);


export default router
