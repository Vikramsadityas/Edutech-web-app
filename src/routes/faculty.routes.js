import { Router } from "express";
import { loginfaculty, 
    logoutfaculty, 
    registerfaculty,
    refreshAccessToken, 
    changepassword, 
    getcurrentfaculty, 
    updatefacultydetail,  } from "../controllers/faculty.controllers.js";
import { verifyJWT } from "../middlewares/auth2.middleware.js";
const router = Router()
router.route("/register").post(registerfaculty)
router.route("/login").post(loginfaculty)

//secured routes
router.route("/logout").post(verifyJWT, logoutfaculty)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/changepassword").post(verifyJWT, changepassword)
router.route("/currentuser").get(verifyJWT, getcurrentfaculty)
router.route("/updateuserdetail").patch(verifyJWT, updatefacultydetail)


export default router