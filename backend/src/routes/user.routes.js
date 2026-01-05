import { Router } from "express";
import {registerUser,loginUser,logout,autoLogin} from "../controllers/user.controller.js";
import { loginInCheck } from "../middleware/auth.middleware.js";



const router = Router();

// for register , login and logout
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post( loginInCheck ,logout)
router.route("/rememberme").get(autoLogin)





export default router