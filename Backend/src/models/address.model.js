import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    contractNumber: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    fullAddress: {
        type: String,
        required: true
    }

}, { timestamps: true })

export const Address = mongoose.model("Address", addressSchema);