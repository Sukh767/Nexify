import express from 'express';
import { createCategory, deleteCategoryById, getAllFrontendCategoryList, getCategoryById, getCategoryList, getEmptyParentCategoryList, updateCategoryById } from '../../controllers/product/productCategory.controllers.js';
import { upload } from '../../middlewares/multer.middlewares.js';

const router = express.Router();


//TODO: Add your routes here
router.post('/',upload.fields([{name: "banner", maxCount:1}]),createCategory)
router.get('/all',getCategoryList)  //Category list items All
router.get('/single', getEmptyParentCategoryList) //get empty parent category list items
router.get('/list', getAllFrontendCategoryList)  //! Frontend parent( main ) category list 
router.get('/:id', getCategoryById) //get category by id
router.delete('/:id', deleteCategoryById) //delete category by id
router.patch('/:id', upload.fields([{name: "banner", maxCount:1}]), updateCategoryById) //update category by id  //TODO: Need o modify the update category by id


export default router;