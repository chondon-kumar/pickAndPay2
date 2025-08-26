import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address"
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending",
        required: true
    }

}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema);