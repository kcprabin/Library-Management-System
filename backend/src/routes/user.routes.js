import { Router } from "express";
import {registerUser,loginUser,logout,autoLogin,getProfile,resetPassword,forgotPassword,updateProfile,changePassword} from "../controllers/user.controller.js";
import { loginInCheck } from "../middleware/auth.middleware.js";



const router = Router();

// for register , login and logout
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post( loginInCheck ,logout)
router.route("/rememberme").get(autoLogin)
router.route("/profile").get( loginInCheck ,getProfile) 
router.route("/updateprofile").put( loginInCheck ,updateProfile)
router.route("/changepassword").post( loginInCheck ,changePassword)
router.route("/resetpassword").post(resetPassword)
router.route("/forgotpassword").post(forgotPassword)



export default router