import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
    
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName : DB_NAME
        });
        console.log("Connected to database:", DB_NAME);
        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
        return connectionInstance

    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
        
    }
}

export { connectDb };