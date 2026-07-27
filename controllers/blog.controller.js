import BlogModel from '../models/blog.model.js'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
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
// var imagesArr = []
// export async function addBlog(request, response) {
//     try {
//         let blog = new BlogModel({
//             title: request.body.title,
//             images: imagesArr,
//             description: request.body.description
//         })
//         if (!blog) {
//             return response.status(200).json({
//                 message: "blog not created",
//                 error: true,
//                 success: false
//             })
//         }

//         blog = await blog.save()
//         imagesArr = []
//         return response.status(200).json({
//             message: 'blog created',
//             error: false,
//             success: true,
//             blog: blog,
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })
//     }
// }



export async function addBlog(request, response) {
    try {
        let blog = new BlogModel({
            title: request.body.title,
            images: imagesArr,
            description: request.body.description
        })
        if (!blog) {
            return response.status(200).json({
                message: "blog not created",
                error: true,
                success: false
            })
        }

        blog = await blog.save()
        imagesArr = []
        return response.status(200).json({
            message: 'blog created',
            blog: blog,
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
export async function getBlogs(request, response) {
    try {


        const page = parseInt(request.query.page) || 1
        const perPage = parseInt(request.query.perPage)
        const totalPosts = await BlogModel.countDocuments()
        const totalPages = Math.ceil(totalPosts / perPage)
        if (page > totalPages) {
            return response.status(404).json({ message: 'page not found', success: false, error: true })
        }

        const blogs = await BlogModel.find()
            .skip((page - 1) * perPage)
            .limit(perPage).exec()
        if (!blogs) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            blogs: blogs,
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






export async function getBlog(request, response) {
    try {
        const blog = await BlogModel.findById(request.params.id)
        if (!blog) {
            return response.status(400).json(
                {
                    message: 'the blog was not found',
                    error: true,
                    success: false
                }
            )
        }
        return response.status(200).json({
            error: false,
            success: true,
            blog: blog
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function deleteBlog(request, response) {
    const blog = await BlogModel.findById(request.params.id)
    const images = blog.images
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
    const deletedBlog = await BlogModel.findByIdAndDelete(request.params.id)
    if (!deletedBlog) {
        response.status(404).json({
            message: 'blog not found',
            success: false,
            error: true
        })
    }
    response.status(200).json({
        success: true,
        error: false,
        message: 'blog deleted'
    })
}

export const updatedBlog = async (request, response) => {
    const blog = await BlogModel.findByIdAndUpdate(

        request.params.id,
        {
            title: request.body.title,
            description: request.body.description,
            images: imagesArr.length > 0 ? imagesArr[0] : request.body.images,
        },
        { new: true }
    )
    if (!blog) {
        return response.status(500).json({
            message: 'blog cannot be updated',
            success: false,
            error: true
        })
    }


    imagesArr = []
    response.status(200).json({
        message: 'blog updated successfully',
        error: false,
        success: true,
        blog: blog
    })
}
