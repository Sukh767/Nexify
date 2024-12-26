import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const verifyjwt = async (req, res, next) => {
  try {
    // Retrieve token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided. Please login.",
      });
    }

    // Verify and decode token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch user from database
    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found. Please register or contact support.",
      });
    }

    // Attach user and decoded token to the request object
    req.user = user;
    req.tokenPayload = decodedToken;

    next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Invalid token. Please login again.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token expired. Please login again.",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Internal Server Error. Please try again later.",
    });
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
