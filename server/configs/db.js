import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("MongoDB connected");
    } catch (error) {
        console.log(`MongoDB Connection Failed ${error}`);
    }
}

export default connectDB