import { DataBaseName } from "../constants.js";
import mongoose from "mongoose";

const dataBase = async () => {
    try {
        const connectionData = await mongoose.connect(`${process.env.MONGODB_URI}/${DataBaseName}`);
        console.log(`connected database ${connectionData.connection.host}`);
    } catch (error) {
        console.log("Failed connection with Database", error);
        process.exit(1);
    }
};

export default dataBase;
