import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';



// Create express app
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Importing routes
import userRouter from './routes/user.routes.js';
import productCategoryRouter from './routes/Product/productCategory.route.js';
import productRouter from './routes/Product/product.routes.js';

//TODO: Add your routes here
app.use('/api/account/user', userRouter);
app.use('/api/products/category', productCategoryRouter);
app.use('/api/products', productRouter);


export {app};