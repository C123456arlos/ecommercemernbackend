import ProductSlideModel from '../models/slide.model.js'
import ProductWeightModel from "../models/productWeight.js"
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
                    console.log(request.files[i].filename,)
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






export async function createSlide(request, response) {
    console.log(request, 'wreiugewo gwey4y5437y545094yt549y5t45 tret tr trhorth hrt rthoyrt')
    try {
        let product = new ProductSlideModel({
            name: request.body.name,
            images: imagesArr,
        })
        product = await product.save()
        if (!product) {
            response.status(500).json({
                error: true,
                success: false,
                message: 'slide not created'
            })
        }
        imagesArr = []
        return response.status(200).json({
            message: "slide created successfully",
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
export async function getSlideById(request, response) {
    try {
        const productSlide = await ProductSlideModel.findById(request.params.id)
        if (!productSlide) {
            return response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: productSlide
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}



export async function getSlide(request, response) {
    // console.log(request.params.id, '123r11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111')
    try {
        const slide = await ProductSlideModel.find()
        // const product = await ProductModel.findById(request.params.id).populate('category')
        if (!slide) {
            return response.status(404).json({
                message: 'the slide is not found',
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: slide
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
