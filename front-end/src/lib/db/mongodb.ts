import mongoose from "mongoose";

const connectDB = async ():Promise<void> => {
    try {
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI as string)
    } catch (error :unknown) {
        console.error("Error connecting to MongoDB :",error)
    }
}


export default connectDB  