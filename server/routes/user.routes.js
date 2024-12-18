import express from "express";
import userList from "../controllers/user/userList.controllers.js";
import { deleteUser, forgotPassword, loginUser, logoutUser, registerUser, resetPassword, updateUserDetails, verifyEmail } from "../controllers/user/user.controllers.js";
import { updateUserRole, updateUserStatus } from "../controllers/user/updateUserStatus.controllers.js";
import { getUserDetails } from "../controllers/user/getUserDetails.controllers.js";
import { authRole, verifyjwt } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/list',verifyjwt,userList) //admin user and supreme user
router.get('/userinfo',verifyjwt,getUserDetails) //user details
router.post('/verify-email',verifyEmail)
router.post('/logout', logoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token',resetPassword)
router.delete('/me/:id',verifyjwt, deleteUser)
router.put('/update-profile/:id', verifyjwt ,updateUserDetails)
router.post('/update-user-status',verifyjwt, updateUserStatus)
router.post('/update-user-role',verifyjwt, authRole ,updateUserRole)


export default router;