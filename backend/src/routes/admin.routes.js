import {Router} from "express"
import {
    adminLogin,
    registerAdmin,
    logoutAdmin,
    getAllAdmin
} from "../controllers/admin.controllers.js"
import { isAdminTrue } from "../middlewares/admin.middlewares.js";

import { verifyJWT, verifyJWTAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register-admin").post(registerAdmin)
router.route("/login-admin").post(adminLogin)
router.route("/logout").post(verifyJWTAdmin,logoutAdmin)
router.route("get-all-admin").get(getAllAdmin)


export default router
