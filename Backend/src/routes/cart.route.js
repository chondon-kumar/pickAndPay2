import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { 
    addCart,
    deleteCart, 
    getCart, 
} from "../controllers/cart.controllers.js";

const cartRouter = Router();

cartRouter.route("/add-to-cart").post( verifyJwt, addCart );
cartRouter.route("/delete-cart/:productId").delete( verifyJwt, deleteCart );
cartRouter.route("/get-cart").get( verifyJwt, getCart );

export { cartRouter };