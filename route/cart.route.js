import { Router } from "express"
import auth from "../middleware/auth.js"
import {
    addAddressController, addToCartItemController, deleteAddressController, deleteCartItemQtyController, editAddress, emptyCartController, getAddressController, getCartItemController,

    getSingleAddressController,

    // selectAddressController,
    updateCartItemQtyController
} from "../controllers/cart.controller.js"

const cartRouter = Router()
cartRouter.post('/add', auth, addToCartItemController)
cartRouter.get('/get', auth, getCartItemController)
cartRouter.put('/update-qty', auth, updateCartItemQtyController)
cartRouter.delete('/delete-cart-item/:id', auth, deleteCartItemQtyController)
cartRouter.post('/address', auth, addAddressController)
cartRouter.get('/get/:id', auth, getAddressController)
cartRouter.delete('/:id', auth, deleteAddressController)

cartRouter.get('/:id', auth, getSingleAddressController)
cartRouter.put('/:id', auth, editAddress)
cartRouter.delete('/emptyCart/:id', auth, emptyCartController)
// cartRouter.put('/selectAddress/:id', auth, selectAddressController)


export default cartRouter