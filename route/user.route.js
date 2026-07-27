import { Router } from 'express'
import { addReview, authWithGoogle, deleteMultiple, forgotPasswordController, getAllReviews, getAllUsers, getReviews, loginUserController, logoutUserController, refreshToken, registerUserController, removeImageFromCloudinary, resetPassword, updateUserDetails, userAvatarController, userDetails, verifyForgotPasswordOtp } from '../controllers/user.controller.js'
import { verifyEmailController } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const userRouter = Router()
userRouter.post('/register', registerUserController)
userRouter.post('/verifyEmail', verifyEmailController)
userRouter.post('/login', loginUserController)
userRouter.post('/authWithGoogle', authWithGoogle)
userRouter.get('/logout', auth, logoutUserController)
userRouter.put('/user-avatar', auth, upload.array('avatar'), userAvatarController)
userRouter.delete('/deleteImage', auth, removeImageFromCloudinary)
userRouter.put('/:id', auth, updateUserDetails)
userRouter.post('/forgot-password', forgotPasswordController)
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.post('/resetPassword', resetPassword)
userRouter.post('/refreshToken', refreshToken)
userRouter.get('/user-details', auth, userDetails)
userRouter.post('/addReview', auth, addReview)
userRouter.get('/getReviews', getReviews)
userRouter.get('/getAllReviews', getAllReviews)
userRouter.get('/getAllUsers', getAllUsers)
userRouter.delete('/deleteMultiple', deleteMultiple)
export default userRouter