import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );

    const options = {
        maxAge: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    res.cookie("token", token, options);

    return token;
}

export default generateTokenAndSetCookie;