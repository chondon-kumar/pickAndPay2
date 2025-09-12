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

const registerUser = asyncHandler( async (req, res) => {
    // get user details from fontend 
    // validation -not empty
    // check if user already exists : userName, email
    // create user object create entry in DB
    // romeve password and refresh token field from response
    // check for user creation
    // return res.

    const { userName, fullName, password, email, role } = req.body

    if(
       [ userName, fullName, password, email, role ].some((items) =>  items?.trim()  ==="")
    ){
     throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or : [
            { userName }, 
            { email }
        ]
    })

    if( existedUser ){
        throw new ApiError(400, "this user is alredy exixt")
    }

    const user =  await User.create({
        userName : userName.tolowerCase(),
        fullName,
        password,
        role, 
        email
    })

    const createdUser = await User.findById(user._id).select( "-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "something is wrong in the server when created user")
    }
    
    return res.status(201).json( 
        new ApiResponse(200, "this User Register successfully", createdUser)
    )
})

const loginUser = asyncHandler( async ( req, res) => {
    // req body from data
    // userName and email check
    // find the User
    // password ckeck
    // access and refresh token create
    // send cookie- sequere
    // return response

    
    const { userName, email, password } = req.body  // get data from fontend
    
    if (!(userName || email)) {
        throw new ApiError(401, "userName or email must be required")
    } // check userName or email incluede

    const user = await User.findOne({
        $or : [ { userName }, { email }]
    })

    if(!user){
        throw new ApiError(404 , " this user does not found ")
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new ApiError(402, " this userName and password does not match")
    }

    const accessToken = user.genareteAccessToken()
    const refereshToken = user.genareteRefreshToken()

    const logInUser = await User.findById(user._id).select(" -password -refreshToken ")

    if (!logInUser) {
        throw new ApiError(509, " login failed ")
    }
    const options = {
        httpOnly : true,
        sequre : true,
        semsite : strict,
        maxAge : 1000*60*60*24*7 // expires for 7 days
    }

    return res
    .status(201)
    .cookie("accessToken", accessToken, options )
    .cookie("refreshToken", refereshToken, options )
    .json( 
        new ApiResponse(201, " User Login successfully ", logInUser, accessToken)
    )


})


export {registerUser} 