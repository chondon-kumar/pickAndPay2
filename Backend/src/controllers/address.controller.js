import asyncHandler from "../utils/asyncHandler.js";
import { Address } from "../models/address.model";
import  { ApiError } from "../utils/apiError.js";
import Apiresponse from "../utils/apiResponse.js";


const createAddress = asyncHandler ( async (req, res) => {
    // get address from font end req.body
    // get user from auth middleware
    // validation not empty
    // create new db call 
    // return res address

    const userId = req.user._id
    const { contractNumber, region, city, fullAddress } = req.body;
    if (!contractNumber || !region || !city || !fullAddress) {
        return next(new ApiError(400, "All fields are required"));
    }
    if (!userId) {
        return next(new ApiError( 404, "User not Authenticated"));
    }
    const address = await Address.create({
        user: userId,
        contractNumber,
        region,
        city,
        fullAddress
    });
    if ( !address ) {
        return next(new ApiError(500, "Address not created in server error"));
    }

    return res
    .status(201)
    .json(new Apiresponse(201, "Address created successfully", address));
});

const editAddress = asyncHandler ( async (req, res) => {
    // get userId from auth middleware
    // userid validation
    // edited address frield from req.body
    // validation not empty
    // Address find by userid and edit and update
    // return res

    const userId = req.user._id;
    const { contractNumber, region, city, fullAddress } = req.body; 
    if (!userId) {
        return next(new ApiError(401, "User not Authenticated"));
    }
    if (!contractNumber || !region || !city || !fullAddress) {
        return next(new ApiError(400, "All fields are required"));
    }
    const address = await Address.findOneAndUpdate(
        { user: userId },
        { contractNumber, region, city, fullAddress },
        { new: true }
    );
    if ( !address ) {
        return next(new ApiError( 500, ""));
    }
    return res
    .status(200)
    .json(new Apiresponse(200, "Address updated successfully", address));
});

const deleteAddress = asyncHandler ( async (req, res) => {
    // get userId from auth middleware
    // userid validation
    // Address find by userid and delete
    // return res

    const userId = req.user._id;
    if (!userId) {
        return next(new ApiError(401, "User not Authenticated"));
    }   

    const address = await Address.findOneAndDelete({ user: userId });
    if ( !address ) {
        return next(new ApiError( 500, "Address not deleted server error"));
    }
    return res
    .status(200)
    .json(new Apiresponse(200, "Address deleted successfully", null));

});

export { 
    createAddress,
    editAddress,
    deleteAddress
};