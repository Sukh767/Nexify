import express from 'express';
import { addToCart, cartCount, clearCart, deleteFromCart, getCartList, removeSingleFromCart, updateCartQty } from '../controllers/cart/cart.controllers.js';
import { verifyjwt } from '../middlewares/auth.middlewares.js';


const router = express.Router();

router.get('/',verifyjwt, getCartList);
router.get('/count',verifyjwt, cartCount);
router.post('/add', verifyjwt, addToCart);
router.delete('/delete/:product_id',verifyjwt, deleteFromCart);
router.post('/remove/:product_id', verifyjwt, removeSingleFromCart);
router.patch('/update', verifyjwt, updateCartQty);
router.delete('/clear', verifyjwt, clearCart);

export default router;