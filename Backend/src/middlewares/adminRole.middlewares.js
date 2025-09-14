import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler.js";    

const adminRole = asyncHandler( async ( req, res, next ) => {
    // req.user is coming from verifyJwt middleware
    // check user role
    // if role is not admin throw error
    // if role is admin allow next()
    

})