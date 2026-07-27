import { Router } from "express"
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js"
import {
    createProductSize,
    deleteProductSize,
    updateProductSize,
    getProductSize,

    getSlideById,
    getSlide,
    createProductWeight,
    deleteProductWeight,
    updateProductWeight,
    getProductWeight,
    getProductWeightById
} from "../controllers/slide.controller.js"
import { createSlide, uploadImages } from "../controllers/slide.controller.js"

const slideRouter = Router()


slideRouter.post('/slide/create', auth, createProductSize)
slideRouter.delete('/slide/:id', deleteProductSize)
slideRouter.put('/slide/:id', auth, updateProductSize)
slideRouter.get('/slide/:id', getSlideById)
slideRouter.get('/get', getSlide)
slideRouter.post('/uploadImages', auth, upload.array('images'), uploadImages)
slideRouter.post('/create', auth, createSlide)



slideRouter.post('/productWeight/create', auth, createProductWeight)
slideRouter.delete('/productWeight/:id', deleteProductWeight)
slideRouter.put('/productWeight/:id', auth, updateProductWeight)

slideRouter.get('/productWeight/get', getProductWeight)
slideRouter.get('/productWeight/:id', getProductWeightById)



export default slideRouter
