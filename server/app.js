import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Create express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions)); // Apply CORS middleware with options
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Importing routes
import userRouter from './routes/user.routes.js';
import productCategoryRouter from './routes/Product/productCategory.route.js';
import productRouter from './routes/Product/product.routes.js';
import productVariantRouter from './routes/Product/productVariant.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import cartRouter from './routes/cart.routes.js';
import orderRouter from './routes/order.routes.js';
import bannerRouter from './routes/banner.routes.js';

// Setup routes
app.use('/api/account/user', userRouter);
app.use('/api/products/category', productCategoryRouter);
app.use('/api/products', productRouter);
app.use('/api/products/variant', productVariantRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);
app.use('/api/banner', bannerRouter);

export { app };