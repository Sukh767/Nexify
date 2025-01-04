import express from 'express';
import { createCategory, deleteCategoryById, getAllFrontendCategoryList, getCategoryById, getCategoryList, getChildCategoryList, getEmptyParentCategoryList, updateCategoryById } from '../../controllers/product/productCategory.controllers.js';
import { upload } from '../../middlewares/multer.middlewares.js';
import { authRole, verifyjwt } from '../../middlewares/auth.middlewares.js';

const router = express.Router();


//TODO: Add your routes here
router.post('/',upload.fields([{name: "banner", maxCount:1}]),  verifyjwt, authRole, createCategory)
router.get('/all',getCategoryList)  //Category list items All
router.get('/single', getEmptyParentCategoryList) //get empty parent category list items
router.get("/child-category", verifyjwt, getChildCategoryList); //get child category list
router.get('/list', getAllFrontendCategoryList)  //! Frontend parent( main ) category list 
router.get('/:id', getCategoryById) //get category by id
router.delete('/:id', verifyjwt, authRole, deleteCategoryById) //delete category by id
router.put('/:id', upload.fields([{name: "banner", maxCount:1}]),  verifyjwt, authRole, updateCategoryById) //update category by id  //TODO: Need o modify the update category by id


export default router;