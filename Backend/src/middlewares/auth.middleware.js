import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler"
import { ApiError } from "../utils/apiError"
import { User } from "../models/user.model"

export const verifyJwt = asyncHandler( async ( req, _, next ) => {
    try {
        // const token = req.cookies?.accessToken || req.header("Authorizetion")?.replace("Bearer ", "")   // get access token from cookies or req.header for mobile systems  
        const token = req.cookies?.accessToken || req.header("Atuthorizetion").split(" ",1)
    
        if (!token) {
            throw new ApiError(401, " Unauthorized request")
        }
    
        const decodeJwt = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET)
        
        if(!decodeJwt){
            throw new ApiError(400, "access token expired ")
        }
    
        const user = await User.findById(decodeJwt._id).select(" -password -refreshToken")
    
        if(!user){
            throw new ApiError(404, " invalid access token ")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError( 404, error?.message || " invalid access token ")
    }
}) 
