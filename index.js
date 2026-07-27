import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDb.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import productRouter from './route/product.route.js'
import upload from './middleware/multer.js'
import cartRouter from './route/cart.route.js'
import myListRouter from './route/mylist.route.js'
// import { addToCartItemController } from './controllers/address.controller.js'
// import { addAddressController } from './controllers/address.controller.js'
import addressRouter from './route/address.route.js'
import bodyParser from 'body-parser'
import homeSlidesRouter from './route/homeSlides.route.js'
import bannerV1Router from './route/bannerV1.route.js'
import blogRouter from './route/blog.route.js'
import orderRouter from './route/order.route.js'
// import slideRouter from './route/slide.route.js'

const app = express()
app.use(express.json())

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors())
app.options('*splat', cors())
app.use(cookieParser())
// app.use(express.bodyParser())
// app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false
}))
app.get('/', (request, response) => {
    response.json({
        message: 'server is running ' + process.env.PORT
    })
})

app.use('/api/user', userRouter)
app.use('/api/address', addressRouter)
app.use('/api/category', categoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/myList', myListRouter)
// app.use('/api/slide', slideRouter)
app.use('/api/homeSlides', homeSlidesRouter)
app.use('/api/bannerV1', bannerV1Router)
app.use('/api/blog', blogRouter)
app.use('/api/order', orderRouter)

// app.use('/api/address', addToCartItemController)




// app.post('/upload-multiple', upload.array('images', 5), (req, res) => {
//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ error: 'No files uploaded' })
//     }

//     const uploadedFiles = req.files.map(file => ({

//         originalname: file.originalname,
//     }))
//     res.json({

//         files: uploadedFiles
//     })

// })




connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log('server running', process.env.PORT)
    })
})