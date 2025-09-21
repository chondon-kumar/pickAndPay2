import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler.js";
import Cart from "../models/cart.model.js"
import { Product } from "../models/product.model.js";

const addCart = asyncHandler( async ( req, res ) => {
    // get a productId and quantity from req.params
    // get userid from auth middleware
    // validation for productid and userid 
    // find product by id 
    // if product not found - return error
    // if product found store product price and quantity
    // calculate total price
    // calculate all cart total price
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
            product : productId,
            quantity,
            totalPrice
        }],
        user: userId,
        allCartPrice : undefined
    })
    if ( !cart ) {
        throw new ApiError( 500, " Internal server error when creating cart ")
    }
    
    // calculate all cart total price
    const allCart = await Cart.find({ user: userId }) // find all cart by user id
    const allCartPrice = allCart.reduce( ( acc, item ) => acc + item.items.totalPrice , 0 )

    cart.allCartPrice = allCartPrice
    await cart.save()

    // return res
    return res
    .status(201)
    .json(new ApiResponse(201, "Product added to cart successfully", cart))

})
const deleteCart = asyncHandler( async ( req, res ) => {
    // get usesId from auth middleware user
    // get productId from req.params
    // validate productId is not empty
    // valodate user is authenticate
    // find cart by using Userid 
    // items.product match Productid 
    // if match item delete 
    // return res new cart 
    
    const userId = req.user._id
    if ( !userId ) {
        throw new ApiError( 401, " Unauthorized user to delete cart ")
    }
    const { productId } = req.params    
    if ( !productId ) {
        throw new ApiError( 400, " ProductId is required ")
    }
    // find cart by using Userid
    const cart = await Cart.findOne({ user: userId })
    if ( !cart ) {
        throw new ApiError( 404, " Cart not found for this user ")
    }  
    // items.product match Productid     
    const itemIndex = cart.items.findIndex( item => item.product.toString() === productId )
    if ( itemIndex === -1 ) {
        throw new ApiError( 404, " Product not found in cart ")
    } 

    cart.items.splice(itemIndex, 1) // remove item from cart

    // calculate all cart total price
    const allCartPrice = cart.items.reduce( ( acc, item ) => acc + item.totalPrice , 0 )
    cart.allCartPrice = allCartPrice

    await cart.save()

    return res
    .status(200)
    .json(new ApiResponse(200, "Product removed from cart successfully", cart))

}) 
const getCart = asyncHandler( async ( req, res ) => {
    
})

export{
    addCart,
    deleteCart, 
    getCart,


}
