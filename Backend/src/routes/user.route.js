import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import verifyJwt from "../middlewares/auth.middleware.js"

const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)

// secure routes
userRouter.route("/logout").post( verifyJwt, logoutUser)

export {userRouter}