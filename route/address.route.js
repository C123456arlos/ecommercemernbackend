
// import { Router } from "express"
// import auth from "../middleware/auth.js"
// import { addAddressController, addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js"
// import { getAddressController } from "../controllers/address.controller.js"

// const addressRouter = Router()

// addressRouter.post('/add', auth, addAddressController)
// addressRouter.get('/get/:id', auth, getAddressController)

// export default addressRouter



// import { Router } from "express"
// import auth from "../middleware/auth.js"
// import { addAddressController, addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js"

// const cartRouter = Router()

// cartRouter.post('/address', auth, addAddressController)

// export default cartRouter





import { Router } from "express"
import auth from "../middleware/auth.js"
import { getAddressController, deleteAddressController, getSingleAddressController, editAddress, addAddressController } from '../controllers/address.controller.js'
const addressRouter = Router()


addressRouter.post('/address', auth, addAddressController)
addressRouter.get('/get/:id', auth, getAddressController)
addressRouter.delete('/:id', auth, deleteAddressController)
addressRouter.get('/:id', auth, getSingleAddressController)
addressRouter.put('/:id', auth, editAddress)



export default addressRouter