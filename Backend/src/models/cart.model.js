import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    items : [{
        product : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product",
        },
        price : {
            type : Number,
            required : true
        },
        quantity: {
        type: Number,
        required: true,
        default: 1
        },
        totalPrice: {
            type: Number,
            required: true
        }
    }],   
    allCartPrice: {
        type: Number,
        required: true
    }

}, { timestamps: true })

export const Cart = mongoose.model("Cart", cartSchema);