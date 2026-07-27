import BannerV1Model from "../models/bannerV1.model.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
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
export async function addBanner(request, response) {
    try {
        let banner = new BannerV1Model({
            bannerTitle: request.body.bannerTitle,
            images: imagesArr,
            subCatId: request.body.subCatId,
            catId: request.body.catId,
            thirdSubCatId: request.body.thirdSubCatId,
            price: request.body.price,
            alignInfo: request.body.alignInfo
        })
        if (!banner) {
            return response.status(200).json({
                message: "banner not created",
                error: true,
                success: false
            })
        }

        banner = await banner.save()
        imagesArr = []
        return response.status(200).json({
            message: 'banner created',
            banner: banner,
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
export async function getBanners(request, response) {
    try {
        const banners = await BannerV1Model.find()
        if (!banners) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            data: banners
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}



export async function deleteBanner(request, response) {
    const banner = await BannerV1Model.findById(request.params.id)
    const images = banner.images
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
    const deletedBanner = await BannerV1Model.findByIdAndDelete(request.params.id)
    if (!deletedBanner) {
        response.status(404).json({
            message: 'banner not found',
            success: false,
            error: true
        })
    }
    response.status(200).json({
        success: true,
        error: false,
        message: 'banner deleted',
    })
}
export const updatedBanner = async (request, response) => {
    const banner = await BannerV1Model.findByIdAndUpdate(

        request.params.id,
        {
            bannerTitle: request.body.bannerTitle,
            images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
            catId: request.body.catId,
            subCatId: request.body.subCatId,
            thirdSubCatId: request.body.thirdSubCatId,
            price: request.body.price,
            alignInfo: request.body.alignInfo
        },
        { new: true }
    )
    if (!banner) {
        return response.status(500).json({
            message: 'banner cannot be updated',
            success: false,
            error: true
        })
    }


    imagesArr = []
    response.status(200).json({
        message: 'banner updated successfully',
        error: false,
        success: true,
        category: banner
    })
}
export async function getBanner(request, response) {
    try {
        const banner = await BannerV1Model.findById(request.params.id)
        if (!banner) {
            response.status(500).json(
                {
                    message: 'the banner was not found',
                    error: true,
                    success: false
                }
            )
        }
        return response.status(200).json({
            error: false,
            success: true,
            banner: banner
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}