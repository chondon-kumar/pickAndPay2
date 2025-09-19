import { Router } from "express";
import { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    updateUserProfile,
    uploadAvatar,
    updateAvatar,
    deleteAvatar } from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import  upload  from "../middlewares/multer.js";

const userRouter = Router() 

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)

// secure routes
userRouter.route("/logout").post( verifyJwt , logoutUser)
userRouter.route("/refresh").post( verifyJwt , refreshAccessToken)
userRouter.route("/change-password").post( verifyJwt , changePassword)
userRouter.route("/update-profile").put( verifyJwt , updateUserProfile)
userRouter.route("/upload-avatar")
        .post( verifyJwt , upload.fields ( [ { name: "avatar", maxCount: 1 } ]), uploadAvatar) // upload single file with field name avatar

userRouter.route("/update-avatar").put( verifyJwt ,upload.single("avatar"), updateAvatar)
userRouter.route("/delete-avatar").delete( verifyJwt , deleteAvatar)

export {userRouter}