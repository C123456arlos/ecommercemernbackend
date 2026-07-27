import UserModel from "../models/user.model.js"
import ReviewModel from "../models/reviews.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendEmailFun from "../config/sendEmail.js"
import { sendEmail } from "../config/emailService.js"
import VerificationEmail from "../utils/verifyEmailTemplate.js"
import generatedAccessToken from "../utils/generatedAccessToken.js"
import generatedRefreshToken from "../utils/generatedRefreshToken.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_SECRET,
    api_secret: process.env.CLOUDINARY_API_KEY,
    secure: true
})
var imagesArr = []


export async function registerUserController(request, response) {
    try {
        let user
        const { name, email, password } = request.body
        console.log(email)
        if (!name || !email || !password) {
            return response.status(400).json({
                message: 'provide email name password',
                error: true,
                success: false
            })
        }
        user = await UserModel.findOne({ email: email })
        if (user) {
            return response.json({
                message: 'user already registered',
                error: true,
                success: false
            })
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)
        user = new UserModel({
            email: email,
            password: hashPassword,
            name: name,
            otp: verifyCode,
            otpExpires: Date.now() + 600000
        })
        await user.save()
        await sendEmailFun({
            to: email,
            subject: 'verify email from ecommerce',
            text: '',
            html: verifyCode
        })

        // await sendEmailFun({
        //     to: email,
        //     subject: 'verify email from ecommerce',
        //     text: '',
        //     html: VerificationEmail(name, verifyCode)
        // })
        // sendEmailFun(email, 'verification email from ecommerce', '', VerificationEmail(name, verifyCode))
        // const resp = sendEmailFun(email, 'verify email', '', 'your otp is ' + verifyCode)
        // sendEmailFun('eleven@eleven.com')
        // await sendEmailFun(email, 'verify email', '', 'your otp is ' + verifyCode)
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        )
        return response.status(200).json({
            success: true,
            error: false,
            message: 'user registered successfully please verify your email',
            token: token
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error
        })
    }
}


export async function authWithGoogle(request, response) {
    const { name, email, password, avatar, mobile, role } = request.body
    try {
        const existingUser = await UserModel.findOne({ email: email })
        if (!existingUser) {
            const user = await UserModel.create({
                name: name,
                mobile: mobile,
                email: email,
                password: 'null',
                avatar: avatar,
                role: role,
                verify_email: true,
                signUpWithGoogle: true
            })
            await user.save()
            const accessToken = await generatedAccessToken(user._id)
            const refreshToken = await generatedRefreshToken(user._id)
            await UserModel.findByIdAndUpdate(user?._id, {
                last_login_date: new Date()
            })

            const cookiesOption = {
                httpOnly: true,
                secure: true,
                sameSIte: 'None'
            }
            response.cookie('accessToken', accessToken, cookiesOption)
            response.cookie('refreshToken', refreshToken, cookiesOption)
            return response.json({
                message: 'login successfully',
                error: false,
                success: true,
                data: {
                    accessToken,
                    refreshToken,
                }
            })
        } else {
            const accessToken = await generatedAccessToken(existingUser._id)
            const refreshToken = await generatedRefreshToken(existingUser._id)
            await UserModel.findByIdAndUpdate(existingUser?._id, {
                last_login_date: new Date()
            })

            const cookiesOption = {
                httpOnly: true,
                secure: true,
                sameSIte: 'None'
            }
            response.cookie('accessToken', accessToken, cookiesOption)
            response.cookie('refreshToken', refreshToken, cookiesOption)
            return response.json({
                message: 'login successfully',
                error: false,
                success: true,
                data: {
                    accessToken,
                    refreshToken,
                }
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



















// await sendEmail({
//     sendTo: email,
//     subject: 'forgot',
//     html: forgotPasswordTemplate({
//         name: user.name
//     })
// })



// const verifyEmailUrl = 'http://localhost:5173'
// const veriFyEmail = await sendEmail({
//     sendTo: email,
//     subject: '',
//     html: verifyEmailTemplate({
//         name,
//         url: VerifyEmailUrl
//     })
// })


























export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return response.status(400).json({ error: true, success: false, message: 'user not found' })
        }
        const isCodeValid = user.otp === otp
        const isNotExpired = user.otpExpires > Date.now()
        if (isCodeValid && isNotExpired) {
            user.verify_email = true
            user.otp = null
            user.otpExpires = null
            await user.save()
            return response.status(200).json({ error: false, success: true, message: 'email verified successfully' })
        } else if (!isCodeValid) {
            return response.status(400).json({ error: true, success: false, message: 'invalid otp' })
        } else {
            return response.status(400).json({ error: true, success: false, message: 'otp expired' })
        }
        // if (!user) {
        //     return response.status(400).json({
        //         message: 'invalid code',
        //         error:true
        //     })
        // }
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function loginUserController(request, response) {
    try {
        const { email, password } = request.body
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            response.status(400).json({
                message: 'user not registered',
                error: true,
                success: false
            })
        }
        if (user.status !== 'Active') {
            return response.status(400).json({
                message: 'contact to admin',
                error: true,
                success: false
            })
        }
        if (user.verify_email !== true) {
            return response.status(400).json({
                message: 'your email is not verified',
                error: true,
                success: false
            })
        }
        const checkPassword = await bcryptjs.compare(password, user.password)
        if (!checkPassword) {
            return response.status(400).json({
                message: 'check your password',
                error: true,
                success: false
            })
        }
        const accessToken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id)
        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSIte: 'None'
        }
        response.cookie('accessToken', accessToken, cookiesOption)
        response.cookie('refreshToken', refreshToken, cookiesOption)
        return response.json({
            message: 'login successfully',
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function logoutUserController(request, response) {


    try {

        const userid = request.userId


        // // const { email } = request.body
        // // const user = await UserModel.findOne({ email: email })
        // const userId = request.userId
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSIte: 'None'
        }

        response.clearCookie('accessToken', cookiesOption)
        response.clearCookie('refreshToken', cookiesOption)
        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refreshToken: ''
        })
        return response.json({
            message: 'logout successfully',
            error: false,
            success: true,

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
export async function userAvatarController(request, response) {
    try {
        imagesArr = []
        const userId = request.userId
        const image = request.files


        const user = await UserModel.findOne({ _id: userId })
        // const userAvatar = user.avatar

        const imgUrl = user.avatar
        const urlArr = imgUrl.split('/')
        const avatar_image = urlArr[urlArr.length - 1]
        const imageName = avatar_image.split('.')[0]
        if (imageName) {
            const res = await cloudinary.uploader.destroy(
                imageName,
                (error, result) => { }
            )
            if (res) {
                response.status(200).send(res)
            }
        }


        // if (!user) {
        //     return response.status(500).json({
        //         message: 'User not found',
        //         error: true,
        //         success: false
        //     })
        // }
        console.log(image)
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        }
        for (let i = 0; i < image?.length; i++) {
            const img = await cloudinary.uploader.upload(
                request.files[i].path,
                options,
                function (error, result) {
                    // console.log(result)
                    imagesArr.push(result?.secure_url)
                    fs.unlinkSync(`uploads/${request.files[i].filename}`)
                    // console.log(request.files[i].filename)
                }
            )
        }
        user.avatar = imagesArr[0]
        await user.save()


        return response.status(200).json({
            _id: userId,
            avatar: imagesArr[0]
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
    // 'https://res.cloudinary.com/dpjcy2t4b/image/upload/v1783191066/1783191067266_shapelined-_JBKdviweXI-unsplash.jpg'
    const urlArr = imgUrl.split('/')
    // ['https:', 'res.cloudinary.com', 'dpjcy2t4b', 'image', 'upload', 'v1783191066', '1783191067266_shapelined-_JBKdviweXI-unsplash.jpg']
    const image = urlArr[urlArr.length - 1]
    const imageName = image.split('.')[0]
    if (imageName) {
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => {

            }
        )
        if (res) {
            response.status(200).send(res)
        }
    }

}
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId
        const { name, email, mobile, password } = request.body
        // console.log(email, 'updaeteupdateudapte')
        const userExist = await UserModel.findById(userId)
        // console.log(userExist, 'useruseruseruser')
        if (!userExist) {
            return response.status(400).send('the user cannot be updated')
        }
        // let verifyCode = ''
        // if (email !== userExist.email) {
        //     verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        // }
        // let hashPassword = ''
        // if (password) {
        //     const salt = await bcryptjs.genSalt(10)
        //     hashPassword = await bcryptjs.hash(password, salt)
        // } else {
        //     hashPassword = userExist.password
        // }
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                name: name,
                mobile: mobile,
                email: email,
                // verify_email: email !== userExist.email ? false : true,
                // // verify_email: email !== userExist.email ? true : false,
                // password: hashPassword,
                // otp: verifyCode !== '' ? verifyCode : null,
                // otpExpires: verifyCode !== '' ? Date.now() + 600000 : ''
            },
            { new: true }
        )
        // if (email !== userExist.email) {
        //     await sendEmailFun({
        //         sendTo: email,
        //         subject: 'verify email from ecommerce app',
        //         text: '',
        //         html: VerificationEmail(name, verifyCode)
        //     })
        // }

        return response.json({
            message: 'user updated successfully',
            error: false,
            success: true,
            // user: updateUser
            user: {
                name: updateUser?.name,
                _id: updateUser?._id,
                email: updateUser?.email,
                mobile: updateUser?.mobile,
                avatar: updateUser?.avatar
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return response.status(400).json({
                message: 'email not available',
                error: true,
                success: false
            })
        } else {
            let verifyCode = Math.floor(100000 + Math.random() * 900000).toString()


            user.otp = verifyCode
            user.otpExpires = Date.now() + 600000
            await user.save()
            // const updateUser = await UserModel.findByIdAndUpdate(
            //     user?._id,
            //     {
            //         otp: verifyCode,
            //         otpExpires: Date.now() + 600000
            //     }, {
            //     new: true
            // }
            // )

            user.otp = verifyCode
            user.otpExpires = Date.now() + 600000

            await user.save(0)
            await sendEmailFun({
                to: email,
                subject: 'verify email from ecommerce app',
                text: '',
                html: VerificationEmail(user?.name, verifyCode)
            })
            return response.json({
                message: 'check email',
                error: false,
                success: true
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
export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return response.status(400).json({
                message: 'email not available',
                error: true,
                success: true
            })
        }
        if (!email || !otp) {
            return response.status(400).json({
                message: 'provide required field',
                error: true,
                success: false
            })
        }

        if (otp !== user.otp) {
            return response.status(400).json({
                message: 'invalid otp',
                error: true,
                success: true
            })
        }
        const currentTime = new Date().toISOString()
        if (user.otpExpires < currentTime) {
            return response.status(400).json({
                messge: 'otp expired',
                error: true,
                success: false
            })
        }

        user.otp = ''
        user.otpExpires = ''
        await user.save()

        return response.status(200).json({
            message: 'otp verfied successfully',
            error: false,
            success: true
        })
    } catch (error) {

    }
}

export async function resetPassword(request, response) {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = request.body

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                error: true,
                success: false,
                message: 'provide required fields email new password confirm password'
            })
        }
        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(400).json({
                message: 'email not available',
                error: true,
                success: false
            })
        }

        if (user?.signUpWithGoogle === false) {
            const checkPassword = await bcryptjs.compare(oldPassword, user.password)
            if (!checkPassword) {
                return response.status(404).json({
                    message: 'old password is wrong',
                    error: true,
                    success: false
                })
            }

        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: 'new password and confirm password must be the same',
                error: true,
                success: false
            })
        }
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(confirmPassword, salt)
        user.password = hashPassword
        user.signUpWithGoogle = false
        await user.save()
        // const update = await UserModel.findOneAndUpdate(user._id, {
        //     password: hashPassword
        // })
        return response.json({
            message: 'password updated successfully',
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
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(' ')[1]
        if (!refreshToken) {
            return response.status(401).json({
                message: 'invalid token',
                error: true,
                success: false
            })
        }
        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)
        if (verifyToken) {
            return response.status(401).json({
                message: 'token expired',
                error: true,
                success: false
            })
        }
        const userId = verifyToken?._id
        const newAccessToken = await generatedAccessToken(userId)
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
        response.cookie('accessToken', newAccessToken, cookiesOption)
        return response.json({
            message: 'new access token',
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function userDetails(request, response) {
    try {
        const userId = request.userId

        const user = await UserModel.findById(userId).select('-password -refresh_token').populate('address_details')
        return response.json({
            message: 'user details',
            data: user,
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
export async function addReview(request, response) {
    try {
        const { image, userName, review, rating, userId, productId } = request.body
        const userReview = await new ReviewModel({
            image: image,
            userName: userName,
            review: review,
            rating: rating,
            userId: userId,
            productId: productId
        })
        await userReview.save()
        return response.status(200).json({
            message: 'review added successfully',
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
export async function getReviews(request, response) {
    try {
        const productId = request.query.productId
        const reviews = await ReviewModel.find({ productId: productId })
        console.log(reviews)
        if (!reviews) {
            return response.status(400).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            reviews: reviews
        })
    } catch (error) {
        return response.status(500).json({
            message: 'review error',
            error: true,
            success: false
        })
    }
}

export async function getAllReviews(request, response) {
    try {
        const reviews = await ReviewModel.find()
        if (!reviews) {
            return response.status(400).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            reviews: reviews
        })
    } catch (error) {
        return response.status(500).json({
            message: 'review error',
            error: true,
            success: false
        })
    }
}
export async function getAllUsers(request, response) {
    try {
        const users = await UserModel.find()
        if (!users) {
            return response.status(400).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            users: users
        })
    } catch (error) {
        return response.status(500).json({
            message: 'get users error',
            error: true,
            success: false
        })
    }
}

export async function deleteMultiple(request, response) {
    const { ids } = request.body
    console.log(ids)
    if (!ids || !Array.isArray(ids)) {
        return response.status(400).json({ error: true, success: false, message: 'invalid input' })
    }
    // for (let i = 0; i < ids?.length; i++) {
    //     const user = await UserModel.findById(ids[i])
    //     const images = user.images
    //     let img = ''
    //     for (img of images) {
    //         const imgUrl = img
    //         const urlArr = imgUrl.split('/')
    //         const image = urlArr[urlArr.length - 1]
    //         const imageName = image.split('.')[0]
    //         if (imageName) {
    //             cloudinary.uploader.destroy(imageName, (error, result) => {

    //             })
    //         }
    //     }
    // }
    try {
        await UserModel.deleteMany({ _id: { $in: ids } })
        return response.status(200).json({
            message: 'user deleted successfully',
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