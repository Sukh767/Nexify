import express from "express";
import userList from "../controllers/user/userList.controllers.js";
import { forgotPassword, loginUser, logoutUser, registerUser, resetPassword, verifyEmail } from "../controllers/user/user.controllers.js";

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/list',userList)
router.post('/verify-email',verifyEmail)
router.post('/logout', logoutUser)
router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)



export default router;