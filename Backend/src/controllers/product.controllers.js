import Product from "../models/products.model.js";
import asyncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { fileUploader } from "../utils/fileUploader.js";
import { Product } from "../models/product.model.js";
   
const createProduct = asyncHandler(async (req, res, next) => {
    // get product detail from req.body
    // get owner details from auth middleware 
    // validation - empty or not
    // upload product image on cloudinary
    // create product and store in DB
    // send response

    const userId = req.user._id 
    if ( !userId ){
        throw new ApiError (402, " Unauthorized user for upload products")
    }
    const { productName, description, price, productImage, category } = req.body // get product details

    if( 
        [ productImage, productName, price, description ]
        .some(( items ) => items?.trim() === "" ) ){
        throw new ApiError (400, " ProductImage, productName, price and description must include ")
    }

    const uploadProductImage = fileUploader( productImage.path );
    if ( !uploadProductImage ) {
        throw new ApiError( 501, " Internal server error when uploadin image on cloudinary ")
    }

    // create product
    try {
        const product = await Product.create({
            productName,
            description,
            price,
            productImage : uploadProductImage,
            category,
            owner: userId
        })
        if ( !product ) {
            throw new ApiError( 500, " Internal server error when creating product ")
        }

    // 3) send response
    return res
    .status(201)
    .json(new ApiResponse(201, "Product created successfully", product ))

    } catch (error) {
        next(new ApiError( 500, " Internal server error when creating product ", error ))
    }
} ) 
const editProduct = asyncHandler(async (req, res, next) => {
    // get product id from req.params
    // get product details from req.body
    // validation - empty or not
    // find product by id and update
    // send response.

    const productId = req.params.id
    const { productName, description, price, productImage, category } = req.body // get product details
    if(
        [ productImage, productName, price, description ]
        .some(( items ) => items?.trim() === "" ) ){
        throw new ApiError (400, " ProductImage, productName, price and description must include ")
    }

    // find product by id and update
    try {
        const product = await Product.findByIdAndUpdate(productId, {
            productName,
            description,
            price,
            productImage,
            category
        }, { new: true })

        if ( !product ) {
            throw new ApiError(404, "Product not found")
        }

        // send response
    return res
    .status(200)
    .json(new ApiResponse(200, "Product updated successfully", product))
    
    } catch (error) {
        next(new ApiError(500, "Internal server error when updating product", error))
    }
    
})
const deleteProduct = asyncHandler(async (req, res, next) => {
    // get product id from req.params
    // find product by id and delete
    // send response
    const productId = req.params.id
    if ( !productId ){
        throw new ApiError(400, " Product id is required ")
    }
    try {
        const product = await Product.findByIdAndDelete(productId)
        if ( !product ) {
            throw new ApiError(404, " Product not found ")
        }
    } catch (error) {
        next(new ApiError(500, " Internal server error when deleting product ", error ))
    }   
    return res
    .status(200)
    .json(new ApiResponse(200, " Product deleted successfully " , {}))
})
const getAllProducts = asyncHandler(async (req, res, next) => {
    // find all products
    // pagination
    // filtering
    // sorting
    // send response

})
const getSingleProduct = asyncHandler(async (req, res, next) => {
    // get product id from req.params
    // find product by id
    // send response
    const productId = req.params.id
    if ( !productId ){
        throw new ApiError(400, " Product id not found  ")
    }
    try {

        const product = await Product.findById( productId )

        if ( !product ) {
            next( new ApiError( 404 , " this product does not found"))
        }

        return res
        .status(200)
        .json( new ApiResponse( 202, " Get single product successfully ", product ))
        
    } catch (error) {
        next( new ApiError( 501, " Internal server error when get product "))
    }
})


export { 
    createProduct,
    editProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct

 }