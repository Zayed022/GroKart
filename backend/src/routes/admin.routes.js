import {Router} from "express"
import {
    adminLogin,
    registerAdmin
} from "../controllers/admin.controllers.js"

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register-admin").post(registerAdmin)
router.route("/login-admin").post(adminLogin)

export default router
