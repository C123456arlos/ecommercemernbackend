import { request } from "express"
import CartProductModel from "../models/cartproduct.model.js"
import MyListModel from "../models/myList.model.js"

export const addToMyListController = async (request, response) => {
    try {
        const userId = request.userId
        const { productId, productTitle, image, rating, price, oldPrice, brand, discount } = request.body
        const item = await MyListModel.findOne({
            userId: userId,
            productId: productId
        })
        console.log(item)
        if (item) {
            return response.status(400).json({
                message: 'item already in my list'
            })
        }
        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId
        })
        const myList = new MyListModel({
            productId,
            productTitle,
            image,
            rating,
            price,
            oldPrice,
            brand,
            discount,
            userId
        })
        const save = await myList.save()
        return response.status(200).json({
            error: false,
            success: true,
            message: 'the product is added in mylist'
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const deleteToMyListController = async (request, response) => {
    try {
        const myListItem = await MyListModel.findById(request.params.id)
        if (!myListItem) {
            return response.status(404).json({
                error: true,
                success: false,
                message: 'the items with this giver id was not found'
            })
        }
        const deletedItem = await MyListModel.findByIdAndDelete(request.params.id)
        if (!deletedItem) {
            return response.status(404).json({
                error: true,
                success: false,
                message: 'the item with this id was not found'
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            message: 'the item removed from mylist'
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const getMyListController = async (request, response) => {
    try {
        const userId = request.userId
        const myListItems = await MyListModel.find({
            userId: userId
        })
        return response.status(200).json({
            error: false,
            success: true,
            data: myListItems
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}