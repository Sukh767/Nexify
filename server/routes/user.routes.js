import express from "express";
import userList from "../controllers/user/userList.controllers.js";
import { loginUser, registerUser } from "../controllers/user/user.controllers.js";

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/list',userList)



export default router;