import { ObjectId } from "mongoose";

export interface IMessage{
    sender:string | ObjectId;
    content:string;
    chatType:'individual' | 'group';
    chatId:string | ObjectId;
}

export interface IMessageResponse {
    _id:string;
    sender:{_id:ObjectId,userName:string};
    content:string;
    chatType:'individual' | 'group';
    chatId:string | ObjectId;
    isRead:string[];
    createdAt:string | Date,
}