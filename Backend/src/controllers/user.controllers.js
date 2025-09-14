import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"


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

    console.log(userName, fullName, email, role)
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
        userName ,
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
        // secure : true,
        sameSite : "Strict",
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

const logoutUser = asyncHandler( async (req, res ) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true
        }
    )
    const options = {
        httpOnly : true,
        // secure : true, 
        sameSite : "Strict",
        maxAge : 1000*60*60*24*7 // expires for 7 days
    }
    return res
    .status(200)
    .clearCookie( accessToken, options )
    .clearCookie(refereshToken, options)
    .json( new ApiResponse(201, " User log out successfully", {}))
})

const refreshAccessToken = asyncHandler( async ( req, res ) => {
  // get refresh token from cookie
  // verify the token
  // find the user
  // genarete new access token and refresh token
  // update refresh token in DB
  // send cookie
  // return response    

  const token = req.cookie?.refereshToken || req.header("Authorizetion").replece("Bearer ", "")

  if ( !token ) {
    throw new ApiError(404, "this refresh token date expired")
  }
  const decodeJwt = jwt.verify( token, process.env.REFRESH_TOKEN_SECRET) // verify token

  if ( !decodeJwt ) {
    throw new ApiError( 401, " Unauthorized request ")
  }

  const user = await User.findById( decodeJwt._id )

    if ( !user || user.refreshToken !== token ) {
      throw new ApiError(401, "Unauthorized request")
    }
    // genarete new tokens
  const newAccessToken = user.genareteAccessToken()
  const newRefreshToken = user.genareteRefreshToken()

  // update referesh token in DB
  const newUser = await User.findByIdAndUpdate(
        user._id,
        {
            $set : {
                refreshToken : newRefreshToken
            }
        },{
            new : true
        }
  ).select(" -password -refreshToken") // select user without password and refreshToken
  const options = {
        httpOnly : true,
        // secure : true, 
        sameSite : "Strict",
        maxAge : 1000*60*60*24*7 // expires for 7 days
    }
// send cookie and response
  return res
  .status(201) 
  .cookie("accessToken", newAccessToken, options) // send cookie
  .cookie("refreshToken", newRefreshToken, options) // send cookie
  .json( new ApiResponse(201, "Genarete new tokens successfully", { user : newUser }))
})
 


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken

} 