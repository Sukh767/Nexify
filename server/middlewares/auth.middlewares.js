import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const verifyjwt = async (req, res, next) => {
  try {
    // Retrieve token from cookies or Authorization header
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

      //console.log(token)

    if (!token) {
      return res
        .status(401)
        .json({ status: "error", message: "Access denied. No token provided. Please login." });
    }

    // Verify and decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    //console.log(decodedToken)

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Attach user to request object for downstream middleware or routes
    req.user = user;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    // Differentiate between invalid token and server error
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ status: "error", message: "Invalid token. Please login again." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ status: "error", message: "Token expired. Please login again." });
    }

    return res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};


export const authRole = async (req, res, next) => {
  //console.log(req.user)
  if (req.user && req.user.isAdmin) {
    console.log(req.user.isAdmin)
      next()
  } else {
      return res.status(403).json({ status: "error", message: "Unauthorized Access" });
  }
}
