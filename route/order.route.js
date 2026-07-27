import { Router } from "express"
import auth from "../middleware/auth.js"
import {
    captureOrderPaypalController,
    createOrderController, createOrderPaypalController, getOrderDetailsController,
    getTotalOrdersCountController,
    totalSalesController,
    totalUserController,
    updateOrderStatusController
} from "../controllers/order.controller.js"

const orderRouter = Router()
orderRouter.post('/create', auth, createOrderController)
orderRouter.get('/order-list', auth, getOrderDetailsController)
orderRouter.get('/create-order-paypal', auth, createOrderPaypalController)
orderRouter.post('/capture-order-paypal', auth, captureOrderPaypalController)
orderRouter.put('/order-status/:id', auth, updateOrderStatusController)
orderRouter.get('/count', auth, getTotalOrdersCountController)
orderRouter.get('/sales', auth, totalSalesController)
orderRouter.get('/users', auth, totalUserController)

export default orderRouter