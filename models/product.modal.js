import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    catName: {
        type: String,
        default: ''
    },
    catId: {
        type: String,
        default: ''
    },
    subCatId: {
        type: String,
        default: ''
    },
    subCat: {
        type: String,
        default: ''
    },
    thirdSubCat: {
        type: String,
        default: ''
    },
    thirdSubCatId: {
        type: String,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        required: true
    },
    sale: {
        type: Number,
        default: 0
    },
    productRam: [
        {
            type: String,
            default: null
        }
    ],
    size: [
        {
            type: String,
            deafult: null
        }
    ],
    productWeight: [
        {
            type: String,
            default: null
        }
    ],
    images: [
        {
            type: String,
            required: true
        }
    ],
    bannerimages: [
        {
            type: String,
            required: true
        }
    ],
    bannerTitleName: {
        type: String,
        // required: true
        default: ''
    },
    isDisplayedOnHomeBanner: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
const ProductModel = mongoose.model('Product', productSchema)
export default ProductModel