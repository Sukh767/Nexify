import express from "express";
import { authRole, verifyjwt } from "../middlewares/auth.middlewares.js";
import { createBrand, deleteBrand, getAllBrands, getBrandById, getProductsByBrand, updateBrand } from '../controllers/brand/brand.controllers.js';
import { upload } from "../middlewares/multer.middlewares.js";


const router = express.Router();

router.post("/", upload.fields([{name: "logo", maxCount: 2}]), verifyjwt, authRole, createBrand); // Create a new brand
router.put("/:id", upload.fields([{name: "logo", maxCount: 2}]), verifyjwt, authRole,updateBrand); // Update a brand by ID
router.get("/", getAllBrands); // Fetch all brands
router.get("/:id/products", verifyjwt, getProductsByBrand); // Fetch products by brand
router.get("/:id", verifyjwt, getBrandById); // Fetch a brand by ID
router.delete("/:id", verifyjwt, authRole, deleteBrand)

export default router;
