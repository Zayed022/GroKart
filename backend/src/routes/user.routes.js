import {Router} from "express"
import {
    loginUser,
    registerUser,
    logoutUser,
   // getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getLoggedInUserDetails
} from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.post("/logout",verifyJWT,logoutUser)
router.get("/profile", verifyJWT,getLoggedInUserDetails)
router.patch("/profile", verifyJWT,updateUserProfile)
router.delete("/profile", verifyJWT,deleteUserAccount)



export default router