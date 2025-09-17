import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import fileUploader from "../utils/fileUploader.js"


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

const changePassword = asyncHandler( async ( req, res ) => {
    // get userId from auth midleware
    // get old password and new password from req.body
    // validation
    // find the user
    // compare old password
    // update new password
    // return response

    const userId = req.user._id // get userId from auth midleware

    if ( !userId ) {
        throw new ApiError( 401, " Unaurhorized user ")
    }
    const { oldPassword , newPassword} = req.body 

    if( !( oldPassword || newPassword )){
        throw new ApiError( 400, " Old password and new password must include ")
    }
    
    const findUser = await User.findById( userId )

    const comparePassword = findUser.comparePassword( oldPassword )

    if (!comparePassword ) {
        throw new ApiError(401, " the password user does not match ")
    }
    
    findUser.password = newPassword // update new password
    await findUser.save() // save the user  

    return res
    .status(200)
    .json( new ApiResponse(200, " Password change successfully ", {})) // return empty object    
})

const updateUserProfile = asyncHandler( async ( req, res ) => {
    // get userId from auth midleware
    // get user details like name, email, from req.body
    // validation
    // find the user and update
    // return response

    const userId = req.user._id 
    if( !userId ){
        throw new ApiError( 401, " This user Unauthorized ")
    }
    const { fullName, email } = req.body

    if( !( fullName || email )){
        throw new ApiError( 400, " fullName and email must include ")
    }     
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set : {
                fullName,
                email
            }
        },{
            new : true
        }
    ).select(" -password -refreshToken ")   
    if ( !updatedUser ) {
        throw new ApiError( 500, " something is wrong in the server when update user profile ")
    }
    return res
    .status(200)
    .json( new ApiResponse( 202, " Update user profile successfully ", updatedUser ))   
})

const uploadAvatar = asyncHandler( async ( req, res ) => { 
    //  get userId from auth midleware
    // get the file from req.file
    // validation
    // upload file to cloudinary
    // find the user
    // update avatar field in DB
    // return response

    const userId = req.user._id // get user id from auth middlewares

    if (!userId ) {
        throw new ApiError( 401, " This user Unauthorized ")
    }

    const file = req.file // this file come from multer middleware
    if ( !file ){
        throw new ApiError ( 404, " Avatar file does not found ")
    }
    const avatarUrl = await fileUploader( file.path ) // upload file to cloudinary

    if ( !avatarUrl ) {
        throw new ApiError( 500, " something is wrong in the server when upload avatar ")
    }
    const user = await User.findByIdAndUpdate(
        userId,
        { 
            $set : { avatar : avatarUrl }
        },{
            new : true
        }
    ).select(" -password -refreshToken ")

    if ( !user ) {
        throw new ApiError( 500, " something is wrong in the server when update avatar ")
    }                   
 
    return res
    .status(200)
    .json( new ApiResponse( 202, " Upload avatar successfully ", user ))
})

const updateAvatar = asyncHandler( async ( req, res ) => {
    // get userId from auth midleware
    // get the file from req.file
    // validation
    // upload file to cloudinary
    // find the user
    // update avatar field in DB
    // return response

    const userId = req.user._id // get user id from auth middlewares

    if (!userId ) {
        throw new ApiError( 401, " This user Unauthorized ")
    }
    const localFilePathfile = req.file // this file come from multer middleware
    if ( !localFilePathfile ){
        throw new ApiError ( 404, " Avatar file does not found ")
    }   
    const avatarUrl = await fileUploader( localFilePathfile.path ) // upload file to cloudinary

    if ( !avatarUrl ) {
        throw new ApiError( 500, " something is wrong in the server when upload avatar ")
    }
    const user = await User.findByIdAndUpdate(
        userId,
        { 
            $set : { avatar : avatarUrl }
        },{
            new : true
        }
    ).select(" -password -refreshToken ")   
    if ( !user ) {
        throw new ApiError( 500, " something is wrong in the server when update avatar ")
    }   

    return res
    .status(200)
    .json( new ApiResponse( 202, " Update avatar successfully ", user ))    
})

const deleteAvatar = asyncHandler( async ( req, res ) => {
    // get userId from auth midleware
    // find the user
    // update avatar field to undefine
    // return response  

    const userId = req.user._id // get user id from auth middlewares

    if (!userId ) {
        throw new ApiError( 401, " This user Unauthorized ")
    }   

    const user = await User.findByIdAndUpdate(
        userId,
        { 
            $set : { avatar : undefined }
        },{
            new : true
        }
    ).select(" -password -refreshToken ")       

    if ( !user ) {
        throw new ApiError( 500, " something is wrong in the server when delete avatar ")
    }
    return res
    .status(200)
    .json( new ApiResponse( 202, " Delete avatar successfully ", user ))    
})


 


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateUserProfile,
    uploadAvatar,
    updateAvatar,
    deleteAvatar

} 