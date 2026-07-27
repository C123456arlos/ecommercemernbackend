import AddressModel from "../models/address.model.js"
import CategoryModel from "../models/category.model.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import categoryRouter from "../route/category.route.js"
import bodyParser from "body-parser"
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })
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





var imagesArr = []
export async function createCategory(request, response) {
    try {
        // imagesArr = []

        // const image = request.files
        // const options = {
        //     use_filename: true,
        //     unique_filename: false,
        //     overwrite: false
        // }
        // for (let i = 0; i < image?.length; i++) {
        //     const img = await cloudinary.uploader.upload(
        //         request.files[i].path,
        //         options,
        //         function (error, result) {
        //             // console.log(result)
        //             imagesArr.push(result?.secure_url)
        //             fs.unlinkSync(`uploads/${request.files[i].filename}`)
        //             // console.log(request.files[i].filename)
        //         }
        //     )
        // }
        let category = new CategoryModel({
            name: request.body.name,
            images: imagesArr,
            parentId: request.body.parentId,
            parentCatName: request.body.parentCatName
        })
        if (!category) {
            return response.status(200).json({
                message: "category not created",
                error: true,
                success: false
            })
        }

        category = await category.save()
        imagesArr = []
        return response.status(200).json({
            message: 'category created',
            category: category,
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
export async function getCategories(request, response) {
    try {
        const categories = await CategoryModel.find()
        const categoryMap = {}
        categories.forEach(cat => {
            categoryMap[cat._id] = { ...cat._doc, children: [] }
        })
        const rootCategories = []
        categories.forEach(cat => {
            if (cat.parentId) {
                categoryMap[cat.parentId].children.push(categoryMap[cat._id])
            } else {
                rootCategories.push(categoryMap[cat._id])
            }
        })
        return response.status(200).json({
            error: false,
            success: true,
            data: rootCategories
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getCategoriesCount(request, response) {
    try {
        const categoryCount = await CategoryModel.countDocuments({ parentId: undefined })
        if (!categoryCount) {
            response.status(500).json({ success: false, error: true })
        } else {
            response.send({
                categoryCount: categoryCount
            })
        }
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const getSubCategoriesCount = async (request, response) => {
    try {
        const categories = await CategoryModel.find()
        if (!categories) {
            response.status(500).json({ success: false, error: true })
        } else {
            const subCatList = []
            for (let cat of categories) {
                if (cat.parentId !== undefined) {
                    subCatList.push(cat)
                }
            }
            response.send({
                subCategoryCount: subCatList.length
            })
        }
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getCategory(request, response) {
    try {
        const category = await CategoryModel.findById(request.params.id)
        if (!category) {
            response.status(500).json(
                {
                    message: 'the category was not found',
                    error: true,
                    success: false
                }
            )
        }
        return response.status(200).json({
            error: false,
            success: true,
            category: category
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
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

export async function deleteCategory(request, response) {
    const category = await CategoryModel.findById(request.params.id)
    const images = category.images
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
    const subCategory = await CategoryModel.find({
        parentId: request.params.id
    })
    for (let i = 0; i < subCategory.length; i++) {
        const thirdSubCategory = await CategoryModel.find({
            parentId: subCategory[i]._id
        })
        for (let i = 0; i < thirdSubCategory.length; i++) {
            const deleteThirdSubCat = await CategoryModel.findByIdAndDelete(thirdSubCategory[i]._id)
        }
        const deletedSubCat = await CategoryModel.findByIdAndDelete(subCategory[i]._id)
    }
    const deletedCat = await CategoryModel.findByIdAndDelete(request.params.id)
    if (!deletedCat) {
        response.status(404).json({
            message: 'category not found',
            success: false,
            error: true
        })
    }
    response.status(200).json({
        success: true,
        message: 'category deleted',
        error: false
    })
}
export const updatedCategory = async (request, response) => {
    console.log(request.userId, 'fdsafdsaaaaaaaaaaaa')
    console.log(request.body, 'ergewrhrtrtwhhhrter')
    const category = await CategoryModel.findByIdAndUpdate(

        request.params.id,
        {
            name: request.body.name,
            images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
            parentId: request.body.parentId,
            parentCatName: request.body.parentCatName
        },
        { new: true }
    )
    if (!category) {
        return response.status(500).json({
            message: 'category cannot be updated',
            success: false,
            error: true
        })
    }


    imagesArr = []
    response.status(200).json({
        message: 'category updated successfully',
        error: false,
        success: true,
        category: category
    })
}


export const deleteAddressController = async (request, response) => {
    console.log(request.body, 'retty654654dsfdfsdfsfdsfsdfdsfdrewrere654')
    try {
        const userId = request.userId
        const _id = request.params.id
        if (!_id) {
            return response.status(400).json({
                message: 'provide _id',
                error: true,
                success: false
            })
        }
        const deleteItem = await AddressModel.deleteOne({ _id: _id, userId: userId })
        if (!deleteItem) {
            return response.status(404).json({
                message: 'the address in the database is not found',
                error: true,
                success: false

            })
        }
        // const address = await AddressModel.findOne({
        //     _id: userId
        // })
        // await address.save()
        return response.json({
            message: 'addresss removed',
            error: false,
            success: true,
            data: deleteItem
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
