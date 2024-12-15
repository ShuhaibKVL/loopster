import mongoose , { ObjectId, Schema} from "mongoose";

interface IChatBotHistory{
    content:string,
    question:string,
    userId:ObjectId
}
const ChatSchema : Schema = new mongoose.Schema<IChatBotHistory>({
    content:{
        type:String,
        required:true
    },
    question:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},{timestamps:true})

// Add a TTL index to the `createdAt` field (expire after 7 days)
ChatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });


const ChatBotHistory = mongoose.model<IChatBotHistory>('ChatBoatHistory',ChatSchema)
export default ChatBotHistory