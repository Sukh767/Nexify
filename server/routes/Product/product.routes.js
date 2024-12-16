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

const router = express.Router();

//TODO: Add the routes for the product controllers

router.get("/", verifyjwt, getAllProducts);
router.post(
  "/",
  upload.fields([{ name: "images", maxCount: 5 }]),
  verifyjwt,
  authRole,
  cleanAndParseBody,
  createProduct
);
router.delete("/:id", verifyjwt, authRole, deleteProduct);
router.patch("/:id", verifyjwt, authRole, cleanAndParseBody, updateProduct); //TODO: fix issues `updateProduct` function
router.get("/search", getSearchedProducts);
router.get("/:id", verifyjwt, getProductById);
router.get("/category-list/:id", frontendProductListByCategory);

export default router;
