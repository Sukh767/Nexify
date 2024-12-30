import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Create express app
const app = express();

// Define allowed origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Block the request
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Importing routes
import userRouter from "./routes/user.routes.js";
import productCategoryRouter from "./routes/Product/productCategory.route.js";
import productRouter from "./routes/Product/product.routes.js";
import productVariantRouter from "./routes/Product/productVariant.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import bannerRouter from "./routes/banner.routes.js";
import brandRouter from "./routes/brand.routes.js";

// Setup routes
app.use("/api/account/user", userRouter);
app.use("/api/products/category", productCategoryRouter);
app.use("/api/products", productRouter);
app.use("/api/products/variant", productVariantRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/brand", brandRouter);

export { app };