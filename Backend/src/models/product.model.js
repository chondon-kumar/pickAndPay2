import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    productName : {
        type: String,
        required: true,
        unique: true,
        index : true
    },
    description: {
        type: String,
        required: true
    },
    productImage: {
        type: [ String ], // Array of image URLs
        required: true
    },
    price : {
        type: String,
        required: true
    },
    category: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema);