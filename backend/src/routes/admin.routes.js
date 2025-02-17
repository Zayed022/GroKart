import {Router} from "express"
import {
    adminLogin,
    registerAdmin,
    getAllAdmin
} from "../controllers/admin.controllers.js"
import { isAdminTrue } from "../middlewares/admin.middlewares.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register-admin").post(registerAdmin)
router.route("/login-admin").post(adminLogin)
router.route("/get-all-admin").get(getAllAdmin)


export default router
