import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";


dotenv.config();

const generateTokensAndSetCookies = (res, userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30m",
    });
  
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });
  
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
  
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  
    return { accessToken, refreshToken };
};  

export {
    generateTokensAndSetCookies,
};
