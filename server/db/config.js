import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";
import color from "colors";
dotenv.config();

const DEFAULT_DB_NAME = "test"; // Fallback database name

const connectDB = async () => {
    try {
        const dbName = DB_NAME || DEFAULT_DB_NAME;
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\nMongoDB connected successfully!!\nDB HOST: ${connectionInstance.connection.host}`.cyan.bold);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;