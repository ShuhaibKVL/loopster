import mongoose , { ObjectId, Schema} from "mongoose";

export interface IChat extends Document{
    chatName?:string,
    isGroupChat:boolean,
    users:[],
    latestMessage?:ObjectId,
    groupAdmin?:ObjectId, 
    groupImage?:string
}

const chatSchema : Schema = new mongoose.Schema<IChat>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" ,required:true}],
    latestMessage:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat 