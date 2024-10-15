import mongoose from "mongoose";

const connectDB = async ():Promise<void> => {
    try {
        console.log(process.env.MONGO_URI)
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('Mongodb connected...')
    } catch (error :any) {
        console.error("Error connecting to MongoDB :",error.message)
    }
}

export default connectDB 
