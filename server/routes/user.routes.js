import express from "express";
import userList from "../controllers/user/userList.controllers.js";
import { loginUser, logoutUser, registerUser, verifyEmail } from "../controllers/user/user.controllers.js";

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/list',userList)
router.post('/verify-email',verifyEmail)
router.post('/logout', logoutUser)



export default router;