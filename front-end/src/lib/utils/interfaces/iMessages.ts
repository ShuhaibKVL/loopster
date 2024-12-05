import { ObjectId } from "mongoose";

export interface IMessage{
    sender:string | ObjectId;
    content:string;
    chatType:'individual' | 'group';
    chatId:string | ObjectId;
    mediaType:'none' | 'video' |'image';
    mediaUrl?:string;
    deleteFromMe?:string[];
}

export interface IMessageResponse {
    _id:string;
    sender:{_id:ObjectId,userName:string};
    content:string;
    chatType:'individual' | 'group';
    chatId:string | ObjectId;
    mediaType:'none' | 'video' |'image';
    mediaUrl?:string;
    deleteFromMe?:string[]
    isRead:string[];
    createdAt:string | Date,
}