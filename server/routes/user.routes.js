import express from "express";
import userList from "../controllers/user/userList.controllers.js";
import { deleteUser, forgotPassword, generateRefreshToken, loginAdmin, loginUser, logoutUser, registerUser, resetPassword, setNewPassword, updateUserDetails, verifyEmail } from "../controllers/user/user.controllers.js";
import { updateUserRole, updateUserStatus } from "../controllers/user/updateUserStatus.controllers.js";
import { getUserDetails } from "../controllers/user/getUserDetails.controllers.js";
import { authRole, verifyjwt } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/admin-login',loginAdmin)
router.get('/refresh-token',generateRefreshToken)
router.get('/list',verifyjwt,userList) //admin user and supreme user
router.get('/userinfo',verifyjwt,getUserDetails) //user details
router.post('/verify-email',verifyEmail)
router.post('/logout', logoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token',resetPassword)
router.post('/set-password',verifyjwt, setNewPassword)
router.delete('/me/:id',verifyjwt, deleteUser)
router.put('/update-profile/:id', verifyjwt ,updateUserDetails)
router.post('/update-user-status',verifyjwt ,authRole, updateUserStatus) //admin user can access
router.post('/update-user-role',verifyjwt, authRole ,updateUserRole) //admin user can access


export default router;