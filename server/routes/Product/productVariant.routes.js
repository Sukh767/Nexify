import express from 'express';
import { createVariantProduct, deleteVariantProductById, getAllVariantProduct, getVariantProductById, updateVariantProductById } from '../../controllers/product/productVariant.controllers.js';
import { upload } from '../../middlewares/multer.middlewares.js';

const router = express.Router();

router.get('/all',getAllVariantProduct);
router.post('/create-variant-product',upload.fields([{name: "banner", maxCount:5}]),createVariantProduct);
router.patch('/update-variant-product/:id',upload.fields([{name: "banner", maxCount:5}]),updateVariantProductById); //TODO: not tested yet
router.delete('/:id',deleteVariantProductById);
router.get('/:id',getVariantProductById);

export default router;