import express from "express";
import userList from "../controllers/user/userList.controllers.js";
import { deleteUser, forgotPassword, loginUser, logoutUser, registerUser, resetPassword, updateUserDetails, verifyEmail } from "../controllers/user/user.controllers.js";
import { updateUserRole, updateUserStatus } from "../controllers/user/updateUserStatus.controllers.js";

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/list',userList)
router.post('/verify-email',verifyEmail)
router.post('/logout', logoutUser)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.delete('/me/:id', deleteUser)
router.put('/update-profile/:id', updateUserDetails)
router.post('/update-user-status', updateUserStatus)
router.post('/update-user-role', updateUserRole)



export default router;