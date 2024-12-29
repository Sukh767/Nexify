import express from 'express';
import { getOrderById, getOrders, OrderListByUser, placeOrder, updateOrderStatus } from '../controllers/order/order.controllers.js';
import { authRole, verifyjwt } from '../middlewares/auth.middlewares.js';

const router = express.Router();

router.post('/',verifyjwt, placeOrder)
router.get('/',verifyjwt, getOrders)
router.get('/:id',verifyjwt, getOrderById)
router.post('/status/:id',verifyjwt, authRole, updateOrderStatus)
router.get('/myorders',verifyjwt, OrderListByUser)
//router.get('/admin/order-details/:id',verifyjwt, authRole, getOrderAllDetailsById)

export default router;