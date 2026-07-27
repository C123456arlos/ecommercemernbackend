import { Router } from "express"
import auth from "../middleware/auth.js"
import upload from "../middleware/multer.js"
import {
    createProductRAMS,
    createProduct, deleteMultipleProduct,
    deleteProduct,
    getAddressController, getAllFeaturedProducts, getAllProducts, getAllProductsByCatId, getAllProductsByCatName, getAllProductsByPrice, getAllProductsByRating, getAllProductsBySubCatId, getAllProductsBySubCatName, getAllProductsByThirdLevelCatId, getProduct, getProductsCount, updateProduct, uploadImages,
    deleteProductRAMS,
    updateProductRAMS,
    getProductRam,
    getProductRamById,
    createProductWeight,
    deleteProductWeight,
    updateProductWeight,
    getProductWeight,
    getProductWeightById,
    createProductSize,
    deleteProductSize,
    updateProductSize,
    getProductSize,
    getProductSizeById,
    filters,
    sortBy,
    uploadBannerImages,
    searchProductController,
    searchProductControllerCont,
    searchProductControllerQuery
} from "../controllers/product.controller.js"
import { removeImageFromCloudinary } from "../controllers/category.controller.js"

const productRouter = Router()
productRouter.post('/uploadImages', auth, upload.array('images'), uploadImages)
// productRouter.post('/uploadBannerImages', auth, uploadBannerImages)
productRouter.post('/uploadBannerImages', auth, upload.array('bannerimages'), uploadBannerImages)
productRouter.post('/create', auth, createProduct)
productRouter.get('/getAllProducts', getAllProducts)
productRouter.get('/getAllProductsByCatId/:id', getAllProductsByCatId)
productRouter.get('/getAllProductsByCatName/', getAllProductsByCatName)
productRouter.get('/getAllProductsBySubCatId/:id', getAllProductsBySubCatId)
productRouter.get('/getAllProductsBySubCatName/', getAllProductsBySubCatName)
productRouter.get('/getAllProductsByThirdLevelCatId/:id', getAllProductsByThirdLevelCatId)
productRouter.get('/getAllProductsByThirdLevelCatName/', getAllProductsBySubCatName)
productRouter.get('/getAllProductsByPrice/', getAllProductsByPrice)
productRouter.get('/getAllProductsByRating/', getAllProductsByRating)
productRouter.get('/getAllFeaturedProducts', getAllFeaturedProducts)
productRouter.get('/getAllProductsCount/', getProductsCount)
productRouter.delete('/deleteMultiple', deleteMultipleProduct)
productRouter.delete('/:id', deleteProduct)
productRouter.get('/:id', getProduct)
productRouter.delete('/deleteimage', auth, removeImageFromCloudinary)
productRouter.put('/updateProduct/:id', auth, updateProduct)
// productRouter.get('/get/:id', auth, getAddressController)
productRouter.post('/productRAMS/create', auth, createProductRAMS)
productRouter.delete('/productRAMS/:id', deleteProductRAMS)
productRouter.put('/productRAMS/:id', auth, updateProductRAMS)

productRouter.get('/productRAMS/get', getProductRam)
productRouter.get('/productRAMS/:id', getProductRamById)

productRouter.post('/productWeight/create', auth, createProductWeight)
productRouter.delete('/productWeight/:id', deleteProductWeight)
productRouter.put('/productWeight/:id', auth, updateProductWeight)

productRouter.get('/productWeight/get', getProductWeight)
productRouter.get('/productWeight/:id', getProductWeightById)

productRouter.post('/productSize/create', auth, createProductSize)
productRouter.delete('/productSize/:id', deleteProductSize)
productRouter.put('/productSize/:id', auth, updateProductSize)

productRouter.get('/productSize/get', getProductSize)
productRouter.get('/productSize/:id', getProductSizeById)


productRouter.post('/filters', filters)
productRouter.post('/sortBy', sortBy)
productRouter.post('/search/get', searchProductController)
productRouter.post('/search/getSearch', searchProductControllerQuery)
productRouter.get('/search/getCont', searchProductControllerCont)
export default productRouter
