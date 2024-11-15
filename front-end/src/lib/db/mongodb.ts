import mongoose from "mongoose";

const connectDB = async ():Promise<void> => {
    try {
        console.log('mongo db URL in next.env',process.env.NEXT_PUBLIC_MONGO_URI)
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI as string)
        console.log('Mongodb connected...')
    } catch (error :any) {
        console.error("Error connecting to MongoDB :",error.message)
    }
}


export default connectDB  