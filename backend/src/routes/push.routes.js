// backend/src/routes/push.routes.js
import {Router} from "express";
import {notifyUsers, notifyAll, saveToken} from "../controllers/push.controllers.js"

// TODO: add real admin auth middleware here
const router = Router();


router.post('/save-token', saveToken);        // public from app (auth optional)
router.post('/notify-all', notifyAll);   // admin only
router.post('/notify-users', notifyUsers); // admin only

export default router
