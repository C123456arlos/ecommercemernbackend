// import { Router } from "express"
// import bodyParser from "body-parser"
// import auth from "../middleware/auth.js"
// import upload from "../middleware/multer.js"
// import { addHomeSlide, deleteMultipleSlides, deleteSlide, getHomeSlides, getSlide, removeImageFromCloudinary, updatedSlide, uploadImages } from "../controllers/homeSlider.controller.js"


// var jsonParser = bodyParser.json()
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

// const homeSlidesRouter = Router()
// homeSlidesRouter.post('/uploadImages', auth, upload.array('images'), uploadImages)
// homeSlidesRouter.post('/add', auth, addHomeSlide)
// homeSlidesRouter.get('/', getHomeSlides)
// homeSlidesRouter.get('/:id', getSlide)
// homeSlidesRouter.delete('/deleteImage', removeImageFromCloudinary)
// homeSlidesRouter.delete('/:id', auth, deleteMultipleSlides)
// homeSlidesRouter.put('/:id', auth, updatedSlide)

// export default homeSlidesRouter



import { Router } from "express"
import bodyParser from "body-parser"
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js"
import { addHomeSlide, deleteMultipleSlides, deleteSlide, getHomeSlides, getSlide, removeImageFromCloudinary, updatedSlide, uploadImages } from "../controllers/homeSlider.controller.js"
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const homeSlidesRouter = Router()
homeSlidesRouter.post('/uploadImages', auth, upload.array('images'), uploadImages)
homeSlidesRouter.post('/add', auth, addHomeSlide)
homeSlidesRouter.get('/', getHomeSlides)
homeSlidesRouter.get('/:id', getSlide)
homeSlidesRouter.delete('/deleteImage', removeImageFromCloudinary)
homeSlidesRouter.delete('/:id', auth, deleteSlide)
homeSlidesRouter.delete('/deleteMultiple', deleteMultipleSlides)
homeSlidesRouter.put('/:id', auth, updatedSlide)
// categoryRouter.delete('/:id', auth, deleteAddressController)

export default homeSlidesRouter