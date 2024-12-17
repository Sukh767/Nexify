import express from "express";
import {
  addToCartDelete,
  addtocartlist,
  addToWishlist,
  itemwishlist,
  removeWishlist,
  wishlist_list,
  wishlistCount,
} from "../controllers/wishlist/wishlist.controllers.js";
import { verifyjwt } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/",verifyjwt ,addToWishlist);
router.get("/", wishlist_list);
router.get("/wishlistitem",verifyjwt, itemwishlist);
router.get("/addtocartlist",verifyjwt, addtocartlist);
router.get("/wishlistcount",verifyjwt, wishlistCount);
router.post("/:id", verifyjwt, removeWishlist);
router.delete("/:cart_id",verifyjwt, addToCartDelete);

export default router;
