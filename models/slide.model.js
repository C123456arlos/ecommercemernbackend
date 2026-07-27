import mongoose from 'mongoose'
const slideSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
}, {
    timestamps: true
})
const ProductSlideModel = mongoose.model('slide', slideSchema)
export default ProductSlideModel