import OrderModel from "../models/order.model.js"
import ProductModel from '../models/product.modal.js'
import UserModel from "../models/user.model.js"
import paypal from '@paypal/checkout-server-sdk'

export const createOrderController = async (request, response) => {
    try {
        let order = new OrderModel({
            userId: request.body.userId,
            products: request.body.products,
            paymentId: request.body.paymentId,
            payment_status: request.body.payment_status,
            delivery_address: request.body.delivery_address,
            totalAmt: request.body.totalAmt,
            date: request.body.date
        })
        if (!order) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        for (let i = 0; i < request.body.products.length; i++) {
            await ProductModel.findByIdAndUpdate(
                request.body.products[i].productId,
                {
                    countInStock: parseInt(request.body.products[i].countInStock - request.body.products[i].quantity)
                }, { new: true }
            )
        }
        order = await order.save()
        return response.status(200).json({
            error: false,
            success: true,
            message: 'order placed',
            order: order
        })
    } catch (error) {
        return response.status(500).json({
            error: true,
            success: false,
            message: error.message || error,
        })
    }
}
export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId
        console.log(userId)
        const { page, limit } = request.query
        const orderList = await OrderModel.find().sort({ createdAt: -1 }).populate('delivery_address userId').skip((page - 1) * limit).limit(parseInt(limit))
        // const orderList = await OrderModel.find().sort({ createdAt: -1 }).populate('delivery_address userId').limit(10).skip(2)
        const total = await OrderModel.countDocuments(orderList)
        return response.json({
            message: 'order list',
            data: orderList,
            error: false,
            success: true,
            total: total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        return response.status(500).json({
            error: true,
            success: false,
            message: error.message || error,
        })

    }
}
function getPayPalClient() {
    const environment = process.env.PAYPAL_MODE === 'live' ?
        new paypal.core.LiveEnvironment(
            process.env.PAYPAL_CLIENT_ID_LIVE,
            process.env.PAYPAL_SECRET_LIVE
        ) :
        new paypal.core.SandboxEnvironment(
            process.env.PAYPAL_CLIENT_ID_TEST,
            process.env.PAYPAL_SECRET_TEST
        )
    return new paypal.core.PayPalHttpClient(environment)
}
export const createOrderPaypalController = async (request, response) => {
    try {
        const req = new paypal.orders.OrdersCreateRequest()
        req.prefer('return=representation')
        req.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: request.query.totalAmount
                }
            }]
        })
        try {
            const client = getPayPalClient()
            const order = await client.execute(req)
            response.json({ id: order.result.id })
        } catch (error) {
            console.error(error)
            response.status(500).send('error creating paypal order')
        }
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const captureOrderPaypalController = async (request, response) => {
    try {
        const { paymentId } = request.body
        const req = new paypal.orders.OrdersCaptureRequest(paymentId)
        req.requestBody({})
        const orderInfo = {
            userId: request.body.userId,
            products: request.body.products,
            paymentId: request.body.paymentId,
            payment_status: request.body.payment_status,
            delivery_address: request.body.delivery_address,
            totalAmt: request.body.totalAmount,
            date: request.body.date
        }
        console.log(request.body.products)
        const order = new OrderModel(orderInfo)
        await order.save()
        for (let i = 0; i < request.body.products.length; i++) {
            await ProductModel.findByIdAndUpdate(
                request.body.products[i].productId,
                {
                    countInStock: parseInt(request.body.products[i].countInStock - request.body.products[i].quantity)
                }, { new: true }
            )
        }
        return response.status(200).json({ success: true, error: false, order: order, message: 'order placed' })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const updateOrderStatusController = async (request, response) => {
    try {
        const { id, order_status } = request.body
        const updateOrder = await OrderModel.updateOne(
            {
                _id: id,

            },
            {
                order_status: order_status
            },
            { new: true }
        )
        return response.status(200).json({
            message: 'order status updated',
            error: false,
            success: true,
            data: updateOrder
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export async function getTotalOrdersCountController(request, response) {
    try {
        const ordersCount = await OrderModel.countDocuments()
        return response.status(200).json({
            error: false,
            success: true,
            count: ordersCount
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const totalSalesController = async (request, response) => {
    try {
        const currentYear = new Date().getFullYear()
        const ordersList = await OrderModel.find()
        let totalSales = 0
        let monthlySales = [
            {
                name: 'jan',
                TotalSales: 0,


            },
            {
                name: 'feb',
                TotalSales: 0,


            },
            {
                name: 'mar',
                TotalSales: 0,


            },
            {
                name: 'apr',
                TotalSales: 0,


            },
            {
                name: 'may',
                TotalSales: 0,


            },
            {
                name: 'jun',
                TotalSales: 0,


            },
            {
                name: 'jul',
                TotalSales: 0,


            },
            {
                name: 'aug',
                TotalSales: 0,


            },
            {
                name: 'sep',
                TotalSales: 0,


            },
            {
                name: 'oct',
                TotalSales: 0,


            },
            {
                name: 'nov',
                TotalSales: 0,


            },
            {
                name: 'dec',
                TotalSales: 0,


            },
        ]
        for (let i = 0; i < ordersList.length; i++) {
            totalSales = totalSales + parseInt(ordersList[i].totalAmt)
            const str = JSON.stringify(ordersList[i]?.createdAt)
            const year = str.substr(1, 4)
            const monthStr = str.substr(6, 8)
            const month = parseInt(monthStr.substr(0, 2))
            if (currentYear == year) {
                if (month === 1) {
                    monthlySales[0] = {
                        name: 'jan',
                        TotalSales: monthlySales[0].TotalSales = parseInt(monthlySales[0].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 2) {
                    monthlySales[1] = {
                        name: 'feb',
                        TotalSales: monthlySales[1].TotalSales = parseInt(monthlySales[1].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 3) {
                    monthlySales[2] = {
                        name: 'mar',
                        TotalSales: monthlySales[2].TotalSales = parseInt(monthlysSales[3].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 5) {
                    monthlySales[4] = {
                        name: 'may',
                        TotalSales: monthlySales[4].TotalSales = parseInt(monthlySales[4].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 6) {
                    monthlySales[5] = {
                        name: 'jun',
                        TotalSales: monthlySales[5].TotalSales = parseInt(monthlySales[5].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 7) {
                    monthlySales[6] = {
                        name: 'jul',
                        TotalSales: monthlySales[6].TotalSales = parseInt(monthlySales[6].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 8) {
                    monthlySales[7] = {
                        name: 'aug',
                        TotalSales: monthlySales[7].TotalSales = parseInt(monthlySales[7].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 9) {
                    monthlySales[8] = {
                        name: 'sep',
                        TotalSales: monthlySales[8].TotalSales = parseInt(monthlySales[8].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 10) {
                    monthlySales[9] = {
                        name: 'oct',
                        TotalSales: monthlySales[9].TotalSales = parseInt(monthlySales[9].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 11) {
                    monthlySales[10] = {
                        name: 'nov',
                        TotalSales: monthlySales[10].TotalSales = parseInt(monthlySales[10].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
                if (month === 12) {
                    monthlySales[11] = {
                        name: 'dec',
                        TotalSales: monthlySales[11].TotalSales = parseInt(monthlySales[11].TotalSales) + parseInt(ordersList[i].totalAmt)
                    }
                }
            }
        }

        return response.status(200).json({
            totalSales: totalSales,
            monthlySales: monthlySales,
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


export const totalUserController = async (request, response) => {
    try {
        const users = await UserModel.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, "_id.month": 1 }
            }
        ])
        let monthlyUsers = [
            {
                name: 'jan',
                TotalUsers: 0,
            },
            {
                name: 'feb',
                TotalUsers: 0,
            },
            {
                name: 'mar',
                TotalUsers: 0,
            },
            {
                name: 'apr',
                TotalUsers: 0,
            },
            {
                name: 'may',
                TotalUsers: 0,
            },
            {
                name: 'jun',
                TotalUsers: 0,
            },
            {
                name: 'jul',
                TotalUsers: 0,
            },
            {
                name: 'aug',
                TotalUsers: 0,
            },
            {
                name: 'sep',
                TotalUsers: 0,
            },
            {
                name: 'oct',
                TotalUsers: 0,
            },
            {
                name: 'nov',
                TotalUsers: 0,
            },
            {
                name: 'dec',
                TotalUsers: 0,
            },
        ]
        for (let i = 0; i < users.length; i++) {
            if (users[i]?._id.month === 1) {
                monthlyUsers[0] = {
                    name: 'jan',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 2) {
                monthlyUsers[1] = {
                    name: 'feb',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 3) {
                monthlyUsers[2] = {
                    name: 'mar',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 4) {
                monthlyUsers[3] = {
                    name: 'apr',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 5) {
                monthlyUsers[4] = {
                    name: 'may',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 6) {
                monthlyUsers[5] = {
                    name: 'jun',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 7) {
                monthlyUsers[6] = {
                    name: 'jul',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 8) {
                monthlyUsers[7] = {
                    name: 'aug',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 9) {
                monthlyUsers[8] = {
                    name: 'sep',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 10) {
                monthlyUsers[9] = {
                    name: 'oct',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 11) {
                monthlyUsers[10] = {
                    name: 'nov',
                    TotalUsers: users[i].count
                }
            }
            if (users[i]?._id.month === 12) {
                monthlyUsers[11] = {
                    name: 'dec',
                    TotalUsers: users[i].count
                }
            }
        }
        return response.status(200).json({
            TotalUsers: monthlyUsers,
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