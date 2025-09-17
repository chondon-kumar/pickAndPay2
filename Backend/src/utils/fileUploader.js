import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const fileUploader = async (localFilePath) => {
    try {
    if (!localFilePath) { 
        console.log("this local file path could not found")
        return null
    }

    const response = await cloudinary.uploader.upload(localFilePath, 
        {resource_type : 'auto'}
    )
    // file upload on cloudinary
     console.log("file upload on cloudinary successfully", response.url);

     return response.url

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove file from local uploads folder
        console.log("error while uploading file on cloudinary", error.message);
        return null
    }
}

export {fileUploader}