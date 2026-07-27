import { Router } from "express"
import bodyParser from "body-parser"
import {
    createCategory, deleteCategory, getCategories, getCategoriesCount, getCategory, getSubCategoriesCount,
    removeImageFromCloudinary,
    updatedCategory, uploadImages,
    deleteAddressController
} from "../controllers/category.controller.js"
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js"
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const categoryRouter = Router()
categoryRouter.post('/uploadImages', auth, upload.array('images'), uploadImages)
categoryRouter.post('/create', auth, createCategory)
categoryRouter.get('/', getCategories)
categoryRouter.get('/get/count', getCategoriesCount)
categoryRouter.get('/get/count/subCat', getSubCategoriesCount)
categoryRouter.get('/:id', getCategory)
categoryRouter.delete('/deleteImage', removeImageFromCloudinary)
categoryRouter.delete('/:id', auth, deleteCategory)
categoryRouter.put('/:id', auth, urlencodedParser, jsonParser, updatedCategory)
// categoryRouter.delete('/:id', auth, deleteAddressController)

export default categoryRouter