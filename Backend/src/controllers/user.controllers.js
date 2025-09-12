import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"

// const genareteTokens = async(userId) => {
//    try {
//      const user = await User.findById(userId)
//      const accessToken = user.genareteAccessToken()
//      const refereshToken = user.genareteRefreshToken()

//      return accessToken, refereshToken

//    } catch (error) {
//     throw new ApiError(401, "something went wrong when creating jwt tokens")
//    }
    
    
// }

const registerUser = asyncHandler(async (req, res) => {
    const {userName, email, password, avatar} = req.body

    if (!userName || !email || !password) {
        throw new ApiError("All fields are required", 400)
    }
    const user = await User.create({ userName, email, password, avatar })
    res.status(201).json(new ApiResponse("User registered successfully", user)) 
})

export {registerUser} 