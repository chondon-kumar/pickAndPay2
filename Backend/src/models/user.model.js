import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true })



export  const User = mongoose.model("User", userSchema);

