import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
 
dotenv.config();

const userSchema = new mongoose.Schema({

    userName : {
        type: String,
        required: true,
        unique: true,
        index : true,
        trim: true
    },
    fullName: {
        type : String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }, 
    avater : {
        type : String,
    },
    refreshToken: {
        type: String
    },
    role : {
        type: String,
        required : true,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true })
// Hash the password before saving the user

userSchema.pre("save", async function (next) {
    const salt = 10
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
};

userSchema.methods.genareteAccessToken = async function () {
    const accessToken =  jwt.sign(
        {   _id : this._id,
            userName : this.userName,
            email : this.email
        },process.env.ACCESS_TOKEN_SECRET,{
           expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    return accessToken
}
userSchema.methods.genareteRefreshToken = async function () {
   const refreshToken =  jwt.sign(
        {   _id : this._id,

        },process.env.REFRESH_TOKEN_SECRET,{
           expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )

    this.refreshToken = refreshToken
    await this.save({ validateBeforeSave : false}) // Save the user with the new refresh token

    return refreshToken
    
}





export const User = mongoose.model("User", userSchema);

