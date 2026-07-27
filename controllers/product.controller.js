import ProductModel from "../models/product.modal.js"
import AddressModel from "../models/address.model.js"
import ProductRAMSModel from "../models/productRAM.js"
import ProductWeightModel from '../models/productWeight.js'
import ProductSizeModel from '../models/productSize.js'

import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import { error } from "console"
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_SECRET,
    api_secret: process.env.CLOUDINARY_API_KEY,
    secure: true
})
var imagesArr = []
export async function uploadImages(request, response) {
    try {
        imagesArr = []
        const image = request.files
        console.log(image)
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        }
        for (let i = 0; i < image?.length; i++) {
            const img = await cloudinary.uploader.upload(
                // request.files[i].path,
                image[i].path,
                options,
                function (error, result) {
                    // console.log(result)
                    imagesArr.push(result?.secure_url)
                    fs.unlinkSync(`uploads/${request.files[i].filename}`)
                    // console.log(request.files[i].filename)
                }
            )
        }
        return response.status(200).json({
            images: imagesArr,
            // images: imagesArr[0]
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

var bannerImage = []
export async function uploadBannerImages(request, response) {
    try {
        bannerImage = []
        const image = request.files
        console.log(image)
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        }
        for (let i = 0; i < image?.length; i++) {
            const img = await cloudinary.uploader.upload(
                // request.files[i].path,
                image[i].path,
                options,
                function (error, result) {
                    // console.log(result)
                    bannerImage.push(result?.secure_url)
                    fs.unlinkSync(`uploads/${request.files[i].filename}`)
                    // console.log(request.files[i].filename)
                }
            )
        }
        return response.status(200).json({
            images: bannerImage,
            // bannerimages: bannerImage,
            // images: imagesArr[0]
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
// export async function uploadImages(request, response) {
//     try {
//         imagesArr = []
//         const image = request.files

//         // const image = request.files.map(file => ({ filename: file.originalname }))
//         const options = {
//             use_filename: true,
//             unique_filename: false,
//             overwrite: false
//         }
//         //     const uploadedFiles = req.files.map(file => ({
//         //         filename: file.filename,
//         //         originalname: file.originalname,
//         //         size: file.size,
//         //         path: file.path
//         //     }))
//         for (let i = 0; i < image?.length; i++) {
//             const img = await cloudinary.uploader.upload(
//                 request.files[i].path,
//                 options,
//                 function (error, result) {
//                     // console.log(result)
//                     imagesArr.push(result?.secure_url)
//                     fs.unlinkSync(`uploads/${request.files[i].filename}`)
//                 }
//             )
//         }

//         return response.status(200).json({
//             // images: image
//             images: image.map(reduce => (
//                 reduce.originalname
//             ))
//             // images: imagesArr[0],
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })
//     }
// }
export async function createProduct(request, response) {
    try {
        let product = new ProductModel({
            name: request.body.name,
            description: request.body.description,
            images: imagesArr,
            bannerimages: bannerImage,
            bannerTitleName: request.body.bannerTitleName,
            isDisplayedOnHomeBanner: request.body.isDisplayedOnHomeBanner,
            brand: request.body.brand,
            price: request.body.price,
            oldPrice: request.body.oldPrice,
            catName: request.body.catName,
            category: request.body.category,
            catId: request.body.catId,
            subCatId: request.body.subCatId,
            subCat: request.body.subCat,
            thirdSubCat: request.body.thirdSubCat,
            thirdSubCatId: request.body.thirdSubCatId,
            countInStock: request.body.countInStock,
            rating: request.body.rating,
            isFeatured: request.body.isFeatured,
            discount: request.body.discount,
            productRam: request.body.productRam,
            size: request.body.size,
            productWeight: request.body.productWeight,
        })
        product = await product.save()
        console.log(product)
        if (!product) {
            response.status(500).json({
                error: true,
                success: false,
                message: 'Product not created'
            })
        }
        imagesArr = []
        return response.status(200).json({
            message: "product created successfully",
            error: false,
            success: true,
            product: product
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getAllProducts(request, response) {
    console.log(request.query)

    try {

        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage)
        const totalPosts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({ message: 'page not found', success: false, error: true })
        }

        const products = await ProductModel.find().populate('category')
            .skip((page - 1) * perPage)
            .limit(perPage).exec()
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: products,
            totalPages: totalPages,
            page: page
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getAllProductsByCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage) || 10000
        const totalPosts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({
                message: 'page not found'
            })
        }
        // const products = ''
        const products = await ProductModel.find({ catId: request.params.id }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getAllProductsByCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage) || 10000
        const totalPosts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({
                message: 'page not found'
            })
        }
        console.log(request.query.catName)
        const products = await ProductModel.find({ catName: request.query.catName }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getAllProductsBySubCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage) || 10000
        const totalPosts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({
                message: 'page not found'
            })
        }
        const products = await ProductModel.find({ subCatId: request.params.id }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getAllProductsBySubCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage) || 10000
        const totalPosts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({
                message: 'page not found'
            })
        }
        const products = await ProductModel.find({ subCat: request.query.subCat }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getAllProductsByThirdLevelCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage) || 10000
        const totalPosts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({
                message: 'page not found'
            })
        }
        const products = await ProductModel.find({ thirdSubCatId: request.params.id }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getAllProductsByThirdLevelCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage) || 10000
        const totalPosts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({
                message: 'page not found'
            })
        }
        const products = await ProductModel.find({ thirdSubCat: request.query.thirdSubCat }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getAllProductsByPrice(request, response) {
    let productList = []
    if (request.query.catId !== '' && request.query.catId !== undefined) {
        const productListArr = await ProductModel.find({
            catId: request.query.catId
        }).populate('category')
        productList = productListArr
    }
    if (request.query.subCatId !== '' && request.query.subCatId !== undefined) {
        const productListArr = await ProductModel.find({
            subCatId: request.query.subCatId
        }).populate('category')
        productList = productListArr
    }
    if (request.query.thirdSubCatId !== '' && request.query.thirdSucCatId !== undefined) {
        const productListArr = await ProductModel.find({
            thirdSubCatId: request.query.thirdSubCatId
        }).populate('category')
        productList = productListArr
    }
    const filteredProducts = productList.filter((product) => {
        if (request.query.minPrice && product.price < parseInt(+request.query.minPrice)) {
            return false
        }
        if (request.query.maxPrice && product.price > parseInt(+request.query.maxPrice)) {
            return false
        }
        return true
    })
    return response.status(200).json({
        error: false,
        success: true,
        products: filteredProducts,
        totalPages: 0,
        page: 0
    })
}

export async function getAllProductsByRating(request, response) {
    try {
        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage) || 10000
        const totalPosts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({
                message: 'page not found'
            })
        }
        let products = []
        if (request.query.catId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                catId: request.query.catId,
            }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()

        }
        if (request.query.subCatId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                subCatId: request.query.subCatId,
            }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()

        }
        if (request.query.thirdSubCatId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                thirdSubCatId: request.query.thirdSubCatId,
            }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()

        }
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getProductsCount(request, response) {
    try {
        const productsCount = await ProductModel.countDocuments()
        if (!productsCount) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            productCount: productsCount
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
// export async function getAllProductsByThirdLevelCatName(request, response) {
//     try {
//         const products = await ProductModel.find({ : request.query.thirdSubCat }).populate('category').skip((page - 1) * perPage).limit(perPage).exec()
//         if (!products) {
//             response.status(500).json({
//                 error: true,
//                 success: false
//             })
//         }
//         return response.status(200).json({
//             error: false,
//             success: true,
//             products: products
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })
//     }
// }

export async function getAllFeaturedProducts(request, response) {
    try {
        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage) || 10000
        const totalPosts = await ProductModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({
                message: 'page not found'
            })
        }
        const products = await ProductModel.find({ isFeatured: true }).populate('category')
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function deleteProduct(request, response) {
    const product = await ProductModel.findById(request.params.id).populate('category')
    if (!product) {
        return response.status(404).json({
            message: 'product not found',
            error: true,
            success: false
        })
    }
    const images = product.images
    for (let img of images) {
        const imgUrl = img
        const urlArr = imgUrl.split('/')
        const image = urlArr[urlArr.length - 1]
        const imageName = image.split('.')[0]
        if (imageName) {
            cloudinary.uploader.destroy(imageName, (error, result) => {

            })
        }
    }
    const deleteProduct = await ProductModel.findByIdAndDelete(request.params.id)
    if (!deleteProduct) {
        response.status(404).json({
            message: 'product not deleted',
            success: false,
            error: true
        })
    }
    return response.status(200).json({
        success: true,
        error: false,
        message: 'product deleted'
    })
}


export async function deleteMultipleProduct(request, response) {
    const { ids } = request.body
    console.log(ids)
    if (!ids || !Array.isArray(ids)) {
        return response.status(400).json({ error: true, success: false, message: 'invalid input' })
    }
    for (let i = 0; i < ids?.length; i++) {
        const product = await ProductModel.findById(ids[i])
        const images = product.images
        let img = ''
        for (img of images) {
            const imgUrl = img
            const urlArr = imgUrl.split('/')
            const image = urlArr[urlArr.length - 1]
            const imageName = image.split('.')[0]
            if (imageName) {
                cloudinary.uploader.destroy(imageName, (error, result) => {

                })
            }
        }
    }
    try {
        await ProductModel.deleteMany({ _id: { $in: ids } })
        return response.status(200).json({
            message: 'product deleted successfully',
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
    // const { ids } = request.body
    // if (!ids || !Array.isArray(ids)) {
    //     return response.status(400).json({ error: true, success: false, message: 'invalid input' })
    // }
    // for (let i = 0; i < ids?.length; i++) {
    //     const product = await ProductModel.findById(ids[i])
    //     const images = product.images
    //     let img = ''
    //     for (img of images) {
    //         const imgUrl = img
    //         const urlArr = imgUrl.split('/')
    //         const image = urlArr[urlArr.length - 1]
    //         const imageName = image.split('.')[0]
    //         if (imageName) {
    //             cloudinary.uploader.destroy(imageName, (error, result) => { })
    //         }
    //     }
    // }
    // try {
    //     await ProductModel.deleteMany({ _id: { $in: ids } })
    //     return response.status(200).json({
    //         message: 'product delete successfully',
    //         error: false,
    //         success: true
    //     })
    // } catch (error) {
    //     return response.status(500).json({
    //         message: error.message || error,
    //         error: true,
    //         success: false
    //     })
    // }
}
export async function getProduct(request, response) {
    try {
        const product = await ProductModel.findById(request.params.id).populate('category')
        if (!product) {
            return response.status(404).json({
                message: 'the product is not found',
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            product: product
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
// export async function removeImageFromCloudinary(request, response) {
//     const imgUrl = request.query.img
//     const urlArr = imgUrl.split('/')
//     const image = urlArr[urlArr.length - 1]
//     const imageName = image.split('.')[0]
//     if (imageName) {
//         const response = await cloudinary.uploader.destroy(
//             imageName,
//             (error, result) => {
//             }
//         )
//         if (response) {
//             response.status(200).send(response)
//         }
//     }
// }
export async function removeImageFromCloudinary(request, response) {
    const imgUrl = request.query.img
    const urlArr = imgUrl.split('/')
    const image = urlArr[urlArr.length - 1]
    const imageName = image.split('.')[0]
    if (imageName) {
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => {

            }
        )
        if (res) {
            return response.status(200).json({
                error: false,
                success: true,
                message: 'image deleted successfully'
            })
        }
    }
}

export async function updateProduct(request, response) {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
                description: request.body.description,
                images: request.body.images,
                bannerimages: request.body.bannerimages,
                isDisplayedOnHomeBanner: request.body.isDisplayedOnHomeBanner,
                bannerTitleName: request.body.bannerTitleName,
                brand: request.body.brand,
                price: request.body.price,
                oldPrice: request.body.oldPrice,
                catId: request.body.catId,
                catName: request.body.catName,
                subCat: request.body.subCat,
                subCatId: request.body.subCatId,
                subCatName: request.body.subCatName,
                category: request.body.category,
                thirdSubCat: request.body.thirdSubCat,
                // thirdSubCatName: request.body.thirdSubCatName,
                thirdSubCatId: request.body.thirdSubCatId,
                countInStock: request.body.countInStock,
                rating: request.body.rating,
                numReviews: request.body.numReviews,
                isFeatured: request.body.isFeatured,
                productRam: request.body.productRam,
                size: request.body.size,
                productWeight: request.body.productWeight,
                // loaction: request.bodyloaction,
            }
        )
        imagesArr = []
        if (!product) {
            return response.status(404).json({
                message: 'the product cannot be updated',
                status: false
            })
        }
        return response.status(200).json({
            message: 'the product is updated',
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const getAddressController = async (request, response) => {
    console.log(request.query, '23145461745')
    console.log(request?.query?.userId, '1265354685')
    try {
        const address = await AddressModel.find({ userId: request?.query?.userId })
        // const address = await AddressModel.findOne({ userId: request?.userId })
        // console.log(address, 'g')
        if (!address) {
            return response.status({
                error: true,
                success: false,
                message: 'address not found'
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            address: address
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            // message: 'unresponsive',
            error: true,
            success: false
        })
    }
}


export async function updateProductRAMS(request, response) {
    try {
        const productRam = await ProductRAMSModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
            }, { new: true }
        )
        if (!productRam) {
            return response.status(404).json({
                message: 'the product ram cannot be updated',
                status: false
            })
        }
        return response.status(200).json({
            message: 'the product ram is updated',
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function createProductRAMS(request, response) {
    try {
        let productRAMS = new ProductRAMSModel({ name: request.body.name })
        // let productRAMS = new ProductRAMSModel({name: request.params.id})
        productRAMS = await productRAMS.save()
        if (!productRAMS) {
            response.status(500).json({
                error: true,
                success: false,
                message: 'Product rams not created'
            })
        }
        return response.status(200).json({
            message: "product rams created successfully",
            error: false,
            success: true,
            product: productRAMS
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}
export async function deleteProductRAMS(request, response) {
    const productRams = await ProductRAMSModel.findById(request.params.id)
    if (!productRams) {
        return response.status(404).json({
            message: 'item product not found',
            error: true,
            success: false
        })
    }

    const deleteProductRams = await ProductRAMSModel.findByIdAndDelete(request.params.id)
    if (!deleteProductRams) {
        response.status(404).json({
            message: 'item not deleted',
            success: false,
            error: true
        })
    }
    return response.status(200).json({
        success: true,
        error: false,
        message: 'product ram deleted'
    })
}
export async function deleteMultipleRAMS(request, response) {
    const { ids } = request.body
    console.log(ids)
    if (!ids || !Array.isArray(ids)) {
        return response.status(400).json({ error: true, success: false, message: 'invalid input' })
    }

    try {
        await ProductRAMSModel.deleteMany({ _id: { $in: ids } })
        return response.status(200).json({
            message: 'product rams deleted successfully',
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getProductRam(request, response) {
    try {
        const productRam = await ProductRAMSModel.find({})
        if (!productRam) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: productRam
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getProductRamById(request, response) {
    try {
        const productRam = await ProductRAMSModel.findById(request.params.id)
        if (!productRam) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: productRam
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}



export async function createProductWeight(request, response) {
    try {
        let productWeight = new ProductWeightModel({ name: request.body.name })
        // let productRAMS = new ProductRAMSModel({name: request.params.id})
        productWeight = await productWeight.save()
        if (!productWeight) {
            response.status(500).json({
                error: true,
                success: false,
                message: 'Product weight not created'
            })
        }
        return response.status(200).json({
            message: "product weight created successfully",
            error: false,
            success: true,
            product: productWeight
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}
export async function deleteProductWeight(request, response) {
    const productWeight = await ProductWeightModel.findById(request.params.id)
    if (!productWeight) {
        return response.status(404).json({
            message: 'item product not found',
            error: true,
            success: false
        })
    }

    const deleteProductWeight = await ProductWeightModel.findByIdAndDelete(request.params.id)
    if (!deleteProductWeight) {
        response.status(404).json({
            message: 'item not deleted',
            success: false,
            error: true
        })
    }
    return response.status(200).json({
        success: true,
        error: false,
        message: 'product weight deleted'
    })
}
export async function deleteMultipleProductWeight(request, response) {
    const { ids } = request.body
    console.log(ids)
    if (!ids || !Array.isArray(ids)) {
        return response.status(400).json({ error: true, success: false, message: 'invalid input' })
    }

    try {
        await ProductWeightModel.deleteMany({ _id: { $in: ids } })
        return response.status(200).json({
            message: 'product weight deleted successfully',
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function updateProductWeight(request, response) {
    try {
        const productWeight = await ProductWeightModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
            }, { new: true }
        )
        if (!productWeight) {
            return response.status(404).json({
                message: 'the product weight cannot be updated',
                status: false
            })
        }
        return response.status(200).json({
            message: 'the product weight is updated',
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getProductWeight(request, response) {
    try {
        const productWeight = await ProductWeightModel.find({})
        if (!productWeight) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: productWeight
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getProductWeightById(request, response) {
    try {
        const productWeight = await ProductWeightModel.findById(request.params.id)
        if (!productWeight) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: productWeight
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}






export async function createProductSize(request, response) {
    try {
        let productSize = new ProductSizeModel({ name: request.body.name })
        // let productRAMS = new ProductRAMSModel({name: request.params.id})
        productSize = await productSize.save()
        if (!productSize) {
            response.status(500).json({
                error: true,
                success: false,
                message: 'Product size not created'
            })
        }
        return response.status(200).json({
            message: "product size created successfully",
            error: false,
            success: true,
            product: productSize
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
}
export async function deleteProductSize(request, response) {
    const productSize = await ProductSizeModel.findById(request.params.id)
    if (!productSize) {
        return response.status(404).json({
            message: 'item product not found',
            error: true,
            success: false
        })
    }

    const deleteProductSize = await ProductSizeModel.findByIdAndDelete(request.params.id)
    if (!deleteProductSize) {
        response.status(404).json({
            message: 'item not deleted',
            success: false,
            error: true
        })
    }
    return response.status(200).json({
        success: true,
        error: false,
        message: 'product size deleted'
    })
}
export async function deleteMultipleProductSize(request, response) {
    const { ids } = request.body
    console.log(ids)
    if (!ids || !Array.isArray(ids)) {
        return response.status(400).json({ error: true, success: false, message: 'invalid input' })
    }

    try {
        await ProductSizeModel.deleteMany({ _id: { $in: ids } })
        return response.status(200).json({
            message: 'product size deleted successfully',
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function updateProductSize(request, response) {
    try {
        const productSize = await ProductSizeModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
            }, { new: true }
        )
        if (!productSize) {
            return response.status(404).json({
                message: 'the product size cannot be updated',
                status: false
            })
        }
        return response.status(200).json({
            message: 'the product size is updated',
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getProductSize(request, response) {
    try {
        const productSize = await ProductSizeModel.find({})
        if (!productSize) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: productSize
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getProductSizeById(request, response) {
    try {
        const productSize = await ProductSizeModel.findById(request.params.id)
        if (!productSize) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: productSize
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function filters(request, response) {
    const { catId, subCatId, thirdSubCatId, minPrice, maxPrice, rating, page, limit } = request.body
    const filters = {}
    if (catId?.length) {
        filters.catId = { $in: catId }
    }
    if (subCatId?.length) {
        filters.subCatId = { $in: subCatId }
    }
    if (thirdSubCatId?.length) {
        filters.thirsSubCatId = { $in: thirdSubCatId }
    }
    if (minPrice || maxPrice) {
        filters.price = { $gte: +minPrice || 0, $lte: +maxPrice || Infinity }
    }
    if (rating?.length) {
        filters.rating = { $in: rating }
    }
    try {
        const products = await ProductModel.find(filters).populate('category').skip((page - 1) * limit).limit(parseInt(limit))
        const total = await ProductModel.countDocuments(filters)
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            total: total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const sortItems = (products, sortBy, order) => {
    return products.sort((a, b) => {
        if (sortBy === 'name') {
            return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        }
        if (sortBy === 'price') {
            return order === 'asc' ? a.price - b.price : b.price - a.price
        }
        return 0
    })
}

export async function sortBy(request, response) {
    const { products, sortBy, order } = request.body
    const sortedItems = sortItems([...products?.products], sortBy, order)
    return response.status(200).json({
        error: false,
        success: true,
        products: sortedItems,
        page: 0,
        totalPages: 0
    })
}
export async function searchProductControllerQuery(request, response) {
    try {
        // const query = request.query.q
        // const { query } = request.body
        // const { page, limit } = request.query
        const { page, limit, query } = request.body
        if (!query) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'query required'
            })
        }
        const products = await ProductModel.find(
            {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { brand: { $regex: query, $options: 'i' } },
                    { catName: { $regex: query, $options: 'i' } },
                    { subCat: { $regex: query, $options: 'i' } },
                    { thirdSubCat: { $regex: query, $options: 'i' } },

                ]
            }
        ).populate('category')
            .skip((page - 1) * limit).limit(parseInt(limit))
        // .skip((page - 1) * limit).limit(1)
        // const total = await products?.length
        const total = await ProductModel.countDocuments(products)

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            // total: 1,
            total: total,
            page: parseInt(page),
            // totalPages: 1
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function searchProductController(request, response) {
    try {
        // const query = request.query.q
        // const { query } = request.body
        const { query, page, limit } = request.body
        if (!query) {
            return response.status(400).json({
                success: false,
                error: true,
                message: 'query required'
            })
        }
        const products = await ProductModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { brand: { $regex: query, $options: 'i' } },
                { catName: { $regex: query, $options: 'i' } },
                { subCat: { $regex: query, $options: 'i' } },
                { thirdSubCat: { $regex: query, $options: 'i' } },

            ]
        }).populate('category')
            .skip((page - 1) * limit).limit(parseInt(limit))
        // .skip((page - 1) * limit).limit(1)
        // const total = await products?.length
        const total = await ProductModel.countDocuments(products)

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            // total: 1,
            total: total,
            page: parseInt(page),
            // totalPages: 1
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function searchProductControllerCont(request, response) {
    try {
        // const query = request.query.q
        // const { query } = request.body
        // const { query, page, limit } = request.body
        const { query, page, limit } = request.query
        // if (!query) {
        //     return response.status(400).json({
        //         success: false,
        //         error: true,
        //         message: 'query required'
        //     })
        // }
        const products = await ProductModel.find(
            // {
            //     $or: [
            //         { 'name': { $regex: 'query', $options: 'i' } },
            //         { 'brand': { $regex: 'query', $options: 'i' } },
            //         { 'catName': { $regex: 'query', $options: 'i' } },
            //         { 'subCat': { $regex: 'query', $options: 'i' } },
            //         { 'thirdSubCat': { $regex: 'query', $options: 'i' } },

            //     ]
            // }
        ).populate('category')
            .skip((page - 1) * limit).limit(parseInt(limit))
        // .skip((page - 1) * limit).limit(1)
        // const total = await products?.length
        const total = await ProductModel.countDocuments(products)
        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            // total: 1,
            total: total,
            page: 2,
            // page: parseInt(page),
            // totalPages: 1
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}