import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    createAddress,
    editAddress,
    deleteAddress
} from "../controllers/address.controller.js";

const addressRouter = Router();

addressRouter.route( "create-address" ).post( verifyJwt, createAddress )
addressRouter.route( "edit-address" ).patch ( verifyJwt, editAddress )
addressRouter.route( "delete-address" ).delete ( verifyJwt, deleteAddress )

export { addressRouter }