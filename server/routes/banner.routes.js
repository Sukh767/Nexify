import express from 'express';
import { authRole, verifyjwt } from '../middlewares/auth.middlewares.js';
import { createBanner, deleteBannerById, getAllBannersDetails, getBannerById, updateBanner } from '../controllers/banner/banner.controllers.js';
import { upload } from '../middlewares/multer.middlewares.js';

const router = express.Router();

router.get('/',getAllBannersDetails);
router.get('/:id',getBannerById);
router.delete('/:id', verifyjwt, authRole, deleteBannerById);
router.post('/', upload.fields([{name: "bannerImages", maxCount: 5}]), verifyjwt, authRole, createBanner);
router.put('/:id', upload.fields([{name: "bannerImages", maxCount: 5}]), verifyjwt, authRole, updateBanner);

export default router;