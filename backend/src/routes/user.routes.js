import {Router} from "express"
import {
    loginUser,
    registerUser,
    logoutUser,
   // getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getLoggedInUserDetails,
    googleLogin,
    searchUser,
    fetchUserOrdersByQuery,
    getUserAccountInfo,
    getAllUsers
} from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.post("/logout",verifyJWT,logoutUser)
router.post("/google-login", googleLogin);
router.get("/profile", verifyJWT,getLoggedInUserDetails)
router.patch("/profile", verifyJWT,updateUserProfile)
router.delete("/profile", verifyJWT,deleteUserAccount)
router.get("/search", searchUser);
router.get('/by-user', fetchUserOrdersByQuery);
router.get("/account-info", getUserAccountInfo);
router.get("/get-all-users",getAllUsers)



export default router