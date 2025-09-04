import mongoose from "mongoose";
import { DB_NAME } from "../../constants";

import dotenv from "dotenv";
dotenv.config();

connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.DB_URL, DB_NAME);
        console.log("Connected to database:", DB_NAME);
        console.log(`MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    

    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
        
    }
}

export { connectDb };