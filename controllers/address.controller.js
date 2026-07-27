// import AddressModel from "../models/address.model.js"
// import UserModel from "../models/user.model.js"
// import { response } from 'express'
// import CartProductModel from "../models/cartproduct.model.js"

// export const addAddressController = async (request, response) => {
//     try {

//         const { address_line1, city, state, pincode, country, mobile, userId, landmark, addressType } = request.body
//         // console.log(request.body, 'dfasdfdfdsrereterthhh')
//         // console.log(address_line1, city, state, pincode, country, mobile, status)
//         // const userId = request.userId
//         // console.log(userId, 'asddgasdgsagasdagsd')
//         // if (!address_line1 || city || state || pincode || country || mobile) {
//         //     return response.status(200).json({
//         //         message: 'provide all the fields',
//         //         error: true,
//         //         success: false
//         //     })
//         // }
//         // const userId = findById()
//         const address = new AddressModel({
//             address_line1, city, state, pincode, country, mobile, userId, landmark, addressType
//         })
//         const savedAddress = await address.save()

//         const updateCartUser = await UserModel.updateOne({ _id: userId }, {
//             $push: {
//                 address_details: savedAddress?._id
//             }
//         })
//         return response.status(200).json({
//             data: savedAddress,
//             message: 'address saved',
//             error: false,
//             success: true
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })

//     }
// }




// import { response } from "express"
// import CartProductModel from "../models/cartproduct.model.js"
// import UserModel from "../models/user.model.js"
// import AddressModel from "../models/address.model.js"
// // export const addToCartItemController = async (request, response) => {
// //     try {
// //         const userId = request.userId
// //         console.log(userId, ';tetetefsdafdsfdsdfsdfsdfsdfsdfsaf')
// //         const { productId } = request.body
// //         if (!productId) {
// //             return response.status(402).json({
// //                 message: 'provide productId',
// //                 error: true,
// //                 success: false
// //             })
// //         }
// //         const checkItemCart = await CartProductModel.findOne({
// //             userId: userId,
// //             productId: productId
// //         })
// //         if (checkItemCart) {
// //             return response.status(400).json({
// //                 message: 'item already in cart'
// //             })
// //         }
// //         const cartItem = new CartProductModel({
// //             quantity: 1,
// //             userId: userId,
// //             productId: productId
// //         })
// //         const save = await cartItem.save()
// //         const updateCartUser = await UserModel.updateOne({ _id: userId }, {
// //             $push: {
// //                 shopping_cart: productId
// //             }
// //         })
// //         return response.status(200).json({
// //             data: save,
// //             message: 'item added successfully',
// //             error: false,
// //             success: true
// //         })
// //     } catch (error) {
// //         return response.status(500).json({
// //             message: error.message || error,
// //             error: true,
// //             success: false
// //         })
// //     }
// // }
// // export const getCartItemController = async (request, response) => {
// //     try {
// //         const userId = request.userId
// //         const cartItem = await CartProductModel.find({
// //             userId: userId
// //         }).populate('productId')
// //         return response.json({
// //             data: cartItem,
// //             error: false,
// //             success: true
// //         })
// //     } catch (error) {
// //         return response.status(500).json({
// //             message: error.message || error,
// //             error: true,
// //             success: false
// //         })
// //     }
// // }
// // export const updateCartItemQtyController = async (request, response) => {
// //     try {
// //         const userId = request.userId
// //         const { _id, qty } = request.body
// //         if (!_id || !qty) {
// //             return response.status(400).json({
// //                 message: 'provide _id, qty'
// //             })
// //         }
// //         const updateCartItem = await CartProductModel.updateOne({
// //             _id: _id,
// //             userId: userId
// //         }, {
// //             quantity: qty
// //         })
// //         return response.json({
// //             message: 'update cart',
// //             success: true,
// //             error: false,
// //             data: updateCartItem
// //         })
// //     } catch (error) {
// //         return response.status(500).json({
// //             message: error.message || error,
// //             error: true,
// //             success: false
// //         })
// //     }
// // }
// // export const deleteCartItemQtyController = async (request, response) => {
// //     try {
// //         const userId = request.userId
// //         const { _id, productId } = request.body
// //         if (!_id) {
// //             return response.status(400).json({
// //                 message: 'provide id',
// //                 error: true,
// //                 success: false
// //             })
// //         }
// //         const deleteCartItem = await CartProductModel.deleteOne({ _id: _id, userId: userId })
// //         if (!deleteCartItem) {
// //             return response.status(404).json({
// //                 message: 'the product in the cart is not found',
// //                 error: true,
// //                 success: false

// //             })
// //         }
// //         const user = await UserModel.findOne({
// //             _id: userId
// //         })
// //         const cartItems = user?.shopping_cart
// //         const updatedUserCart = [...cartItems.slice(0, cartItems.indexOf(productId)), ...cartItems.slice(cartItems.indexOf(productId) + 1)]
// //         const userCartItem = await UserModel.findOne({ _id: userId })
// //         user.shopping_cart = updatedUserCart
// //         await user.save()
// //         return response.json({
// //             message: 'item remove',
// //             error: false,
// //             success: true,
// //             data: deleteCartItem
// //         })
// //     } catch (error) {
// //         return response.status(500).json({
// //             message: error.message || error,
// //             error: true,
// //             success: false
// //         })
// //     }
// // }
// export const addAddressController = async (request, response) => {
//     console.log(request.body, '1234')
//     try {
//         const { address_line1, city, state, pincode, country, mobile, status } = request.body
//         // console.log(address_line1, city, state, pincode, country, mobile, status)
//         const userId = request.userId
//         // if (!address_line1 || city || state || pincode || country || mobile) {
//         //     return response.status(200).json({
//         //         message: 'provide all the fields',
//         //         error: true,
//         //         success: false
//         //     })
//         // }
//         // const userId = findById()
//         const address = new AddressModel({
//             address_line1, city, state, pincode, country, mobile, status,
//         })
//         const savedAddress = await address.save()

//         const updateCartUser = await UserModel.updateOne({ _id: userId }, {
//             $push: {
//                 address_details: savedAddress?._id
//             }
//         })
//         return response.status(200).json({
//             data: savedAddress,
//             message: 'address saved',
//             error: false,
//             success: true
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })

//     }
// }

// export const getAddressController = async (request, response) => {
//     console.log(request.body, 'aadsagdsgdsdgsadgsgdsagreretrrthryj476675467545')
//     try {
//         const address = await AddressModel.find({ userId: request?.query?.userId })
//         console.log(address, 'fdasdssdsddsa')
//         if (!address) {
//             return response.status({
//                 error: true,
//                 success: false,
//                 message: 'address not found'
//             })
//         }
//         return response.status({
//             error: false,
//             success: true,
//             address: address
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             // message: 'unresponsive',
//             error: true,
//             success: false
//         })
//     }
// }






import { response } from "express"
import CartProductModel from "../models/cartproduct.model.js"
import ProductSlideModel from "../models/slide.model.js"
import UserModel from "../models/user.model.js"
import AddressModel from "../models/address.model.js"




export const addAddressController = async (request, response) => {
    try {

        const { address_line1, city, state, pincode, country, mobile, userId, landmark, addressType } = request.body
        // console.log(request.body, 'dfasdfdfdsrereterthhh')
        // console.log(address_line1, city, state, pincode, country, mobile, status)
        // const userId = request.userId
        // console.log(userId, 'asddgasdgsagasdagsd')
        // if (!address_line1 || city || state || pincode || country || mobile) {
        //     return response.status(200).json({
        //         message: 'provide all the fields',
        //         error: true,
        //         success: false
        //     })
        // }
        // const userId = findById()
        const address = new AddressModel({
            address_line1, city, state, pincode, country, mobile, userId, landmark, addressType
        })
        const savedAddress = await address.save()

        const updateCartUser = await UserModel.updateOne({ _id: userId }, {
            $push: {
                address_details: savedAddress?._id
            }
        })
        return response.status(200).json({
            data: savedAddress,
            message: 'address saved',
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

// export const addAddressController = async (request, response) => {
//     try {
//         const { address_line1, city, state, pincode, country, mobile, status, selected } = request.body
//         const userId = request.userId

//         // if (!address_line1 || city || state || pincode || country || mobile) {
//         //     return response.status(200).json({
//         //         message: 'provide all the fields',
//         //         error: true,
//         //         success: false
//         //     })
//         // }
//         // const userId = findById()
//         const address = new AddressModel({
//             address_line1, city, state, pincode, country, mobile, status, userId, selected
//         })
//         const savedAddress = await address.save()

//         const updateCartUser = await UserModel.updateOne({ _id: userId }, {
//             $push: {
//                 address_details: savedAddress?._id
//             }
//         })
//         return response.status(200).json({
//             data: savedAddress,
//             message: 'address saved',
//             error: false,
//             success: true
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })

//     }
// }

// export const getAddressController = async (request, response) => {
//     // console.log(request.query, 'wewqwrgwqqwrqwrews')
//     console.log(request.body)
//     // console.log(request?.query?.userId, 'rwrwgqrgrqrqrwg')
//     try {
//         // const address = await AddressModel.findOne({ userId: request?.query?.userId })
//         const address = await AddressModel.findOne({ userId: request?.body.userId })
//         console.log(address, 'afdsadggreqegregr')
//         if (!address) {
//             return response.status(500).json({
//                 error: true,
//                 success: false,
//                 message: 'address not found'
//             })
//         }
//         return response.status(200).json({
//             error: false,
//             success: true,
//             address: address
//         })
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             // message: 'unresponsive',
//             error: true,
//             success: false
//         })
//     }
// }


export const getAddressController = async (request, response) => {
    try {
        // const address = await AddressModel.find({ userId: request?.userId })
        const address = await AddressModel.find({ userId: request?.userId })
        // console.log(address, 'g')
        console.log(address, 'afdsadggreqegregr')
        if (!address) {
            return response.status(200).json({
                error: true,
                success: false,
                message: 'address not found'
            })
        } else {
            // const updateUser = await UserModel.updateOne({ userId: request?.userId }, {
            //     // const updateUser = await UserModel.updateOne({ _id: request?.query?.userId }, {
            //     $push: {
            //         address: address_id
            //     }
            // })
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
// export const selectAddressController = async (request, response) => {
//     try {
//         const userId = request.userId
//         const address = await AddressModel.find({
//             _id: request.params.id,
//             userId: userId
//         })

//         const updateAddress = await AddressModel.find(
//             {
//                 userId:userId
//             }
//         )


//         if (!address) {
//             return response.status(500).json({
//                 message: error.message || error,
//                 error: true,
//                 success: false
//             })
//         } else {
//             const updateAddress = await AddressModel.findByIdAndUpdate(
//                 request.params.id,
//                 {
//                     selected: request?.body?.selected,
//                 },
//                 { new: true }
//             )
//             return response.json({
//                 error: false,
//                 success: true,
//                 // user: updateUser
//                 address: updateAddress
//             })
//         }
//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false
//         })
//     }
// }
export const deleteAddressController = async (request, response) => {
    console.log(request.body, 'retty654654654')
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
export const getSingleAddressController = async (request, response) => {
    console.log(request.body, 'retty654654654')
    try {
        const id = request.params.id
        const address = await AddressModel.findOne({ _id: id })
        if (!address) {
            return response.status(404).json({
                message: 'address not found',
                error: true,
                success: false
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
            error: true,
            success: false
        })
    }
}



export async function editAddress(request, response) {
    try {
        const id = request.params.id
        const { address_line1, city, state, pincode, country, mobile, userId, landmark, addressType } = request.body
        // if (password) {
        //     const salt = await bcryptjs.genSalt(10)
        //     hashPassword = await bcryptjs.hash(password, salt)
        // } else {
        //     hashPassword = userExist.password
        // }
        const address = await AddressModel.findByIdAndUpdate(
            id,
            {
                address_line1: address_line1,
                city: city,
                state: state,
                pincode: pincode,
                country: country,
                mobile: mobile,
                landmark: landmark,
                addressType: addressType
            },
            { new: true }
        )
        return response.json({
            message: 'address updated successfully',
            error: false,
            success: true,
            // user: updateUser
            address: address
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}