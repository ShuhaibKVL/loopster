import mongoose, { ObjectId } from "mongoose";

export interface IMessage{
  sender:string | ObjectId;
  content:string;
  chatType:'individual' | 'group';
  chatId:string | ObjectId;
}


export interface IMessageResponse extends Document, IMessage {
  _id: ObjectId; // Mongoose default for `_id`
  isRead:string[]
}

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    chatType: { type: String, enum: ['individual', 'group'], required: true },
    chatId: {
      type: mongoose.Schema.Types.ObjectId, 
      refPath:'Chat',
      required: true 
    },
    isRead:{type:Array}
},{timestamps:true});

export const Message = mongoose.model('Message', messageSchema);