import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"

 const verifyJwt = asyncHandler( async ( req, res, next ) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")   // get access token from cookies or req.header for mobile systems  
        // const token = req.cookies?.accessToken || req.header("Atuthorizetion").split(" ",1)
        
        // here is a problem req.cookies is ruturn empty object

        if (!token) {
            throw new ApiError(401, " Unauthorized request")
        }
    
        const decodeJwt = jwt.verify( token , process.env.ACCESS_TOKEN_SECRET)

        console.log(decodeJwt)
        
        if(!decodeJwt){
            throw new ApiError(400, "access token expired ")
        }
    
        const user = await User.findById(decodeJwt._id).select(" -password -refreshToken")
    
        if(!user){
            throw new ApiError(404, " invalid access tokens ") 
        }
        
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(404, " invalid access token ")
    }
}) 

export { verifyJwt }