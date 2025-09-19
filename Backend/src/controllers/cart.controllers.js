import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";
import Cart from "../models/cart.model.js"
import { Product } from "../models/product.model.js";

const addCart = asyncHandler( async ( req, res ) => {
    // get a productId and quantity from req.params
    // get userid from auth middleware
    // validation for productid and userid 
    //find product by id 
    // if product not found - return error
    // if product found store product price and quantity
    // calculate total price
    // create a cart in db
    // return res

    const userId = req.user._id
    if ( !userId ) {
        throw new ApiError( 401, " Unauthorized user to add cart ")
    }
    const { productId, quantity } = req.body
    if ( !productId || !quantity ) {
        throw new ApiError( 400, " ProductId and quantity are required ")
    }

    //find product by id
    const product = await Product.findById(productId)
    if ( !product ) {
        throw new ApiError( 404, " Product not found ")
    }

    // if product found store product price and quantity
    const productPrice = product.price
    const totalPrice = productPrice * quantity

    // create a cart in db
    const cart = await Cart.create({
        items: [{
            product: productId,
            quantity,
            totalPrice
        }],
        user: userId

    })

    // return res
    return res
    .status(201)
    .json(new ApiResponse(201, "Product added to cart successfully", cart))

})
const deleteCart = asyncHandler( async ( req, res ) => {
    
})
const removeCart = asyncHandler( async ( req, res ) => {
    
})
const getCart = asyncHandler( async ( req, res ) => {
    
})

export{
    addCart,
    deleteCart,
    removeCart,
    getCart,


}
