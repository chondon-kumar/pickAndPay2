import Router from "express"
import { 
    createProduct,
    editProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct
  } from "../controllers/product.controllers.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { authRole } from "../middlewares/authorizedRole.middlewares.js"
import upload from "../middlewares/multer.js"

const productRouter = Router()

productRouter.route("/create-product")
            .post( 
                verifyJwt, 
                authRole( "admin" ),
                upload.array( " productImage ", 5 ), 
                createProduct
                 );

productRouter.route("/edit-product")
            .post(
                 verifyJwt,
                  authRole( "admin" ),
                   upload.array( " productImage ", 5 ),
                    editProduct
                 );

productRouter.route( "/delete-product" )
              .post( 
                 verifyJwt,
                 authRole( "admin" ),
                 deleteProduct
              );

productRouter.route( "/get-all-product" )
              .get(
                verifyJwt,
                authRole( "admin" ),
                getAllProducts
              )
              
productRouter.route( "/get-single-product" )
              .get(
                verifyJwt,
                authRole( "admin" ),
                getSingleProduct
              )


export { productRouter } ;