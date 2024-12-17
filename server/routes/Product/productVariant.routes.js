import express from "express";
import {
  createVariantProduct,
  deleteVariantProductById,
  getAllVariantProduct,
  getVariantProductById,
  updateVariantProductById,
} from "../../controllers/product/productVariant.controllers.js";
import { upload } from "../../middlewares/multer.middlewares.js";
import { authRole, verifyjwt } from "../../middlewares/auth.middlewares.js";

const router = express.Router();

// Get all variant products
router.get("/all", getAllVariantProduct);

// Create a new variant product
router.post(
  "/",
  upload.fields([{ name: "banner", maxCount: 5 }]),
  verifyjwt,
  authRole,
  createVariantProduct
);

// Get a single variant product by ID
router.get("/:id", getVariantProductById);

// Update a variant product by ID
router.patch(
  "/:id",
  upload.fields([{ name: "banner", maxCount: 5 }]),
  verifyjwt,
  authRole,
  updateVariantProductById
);

// Delete a variant product by ID
router.delete("/:id", verifyjwt, authRole, deleteVariantProductById);

export default router;
