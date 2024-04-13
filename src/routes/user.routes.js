import { Router } from "express";
import { loginuser, 
    logoutuser, 
    registeruser,
    refreshAccessToken, 
    changepassword, 
    getcurrentuser, 
    updateuserdetail, 
 } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.route("/register").post(registeruser)
router.route("/login").post(loginuser)

//secured routes
router.route("/logout").post(verifyJWT, logoutuser)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/changepassword").post(verifyJWT, changepassword)
router.route("/currentuser").get(verifyJWT, getcurrentuser)
router.route("/updateuserdetail").patch(verifyJWT, updateuserdetail)


export default router
