import express from "express";
import {
  createProduct,
  deleteProduct,
  frontendProductListByCategory,
  getAllProducts,
  getProductById,
  getSearchedProducts,
  updateProduct,
} from "../../controllers/product/product.controllers.js";
import { authRole, verifyjwt } from "../../middlewares/auth.middlewares.js";
import { upload } from "../../middlewares/multer.middlewares.js";
import cleanAndParseBody from "../../middlewares/cleanAndParseBody.middlewares.js";
import { searchItem } from "../../controllers/product/searchProduct.controllers.js";
import frontendSingleProduct from "../../controllers/product/frontendSingleProduct.controllers.js";

const router = express.Router();

// Product Routes

// Public Routes
router.get("/search", searchItem); // Search by query: ?keyword=someValue
router.get("/category-list/:id", frontendProductListByCategory); //TODO: Fix this route getting blank response
router.get("/details/:id", verifyjwt, frontendSingleProduct);

// Authenticated Routes
router.get("/", verifyjwt, getAllProducts);
router.get("/:id", verifyjwt, getProductById);

// Admin Routes
router.post(
  "/",
  upload.fields([{ name: "images", maxCount: 5 }]),
  verifyjwt,
  authRole,
  cleanAndParseBody,
  createProduct
);
router.delete("/:id", verifyjwt, authRole, deleteProduct);
router.put(
  "/:id",
  upload.fields([{ name: "images", maxCount: 5 }]),
  verifyjwt,
  authRole,
  cleanAndParseBody,
  updateProduct
);

export default router;
