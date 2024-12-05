import mongoose, { ObjectId } from "mongoose";

export interface IMessage{
  sender:string | ObjectId;
  content:string;
  chatType:'individual' | 'group';
  chatId:string | ObjectId;
  mediaType:'none' | 'video' |'image';
  mediaUrl?:string;
  deleteFromMe?:string[];
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
    mediaType:{type:String,enum:['none','video','image'],default:'none'},
    mediaUrl:{type:String},
    deleteFromMe:{type:Array,unique:true},
    isRead:{type:Array,unique:true }
},{timestamps:true});

export const Message = mongoose.model('Message', messageSchema);