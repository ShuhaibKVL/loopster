import { ObjectId } from "mongoose";

export interface IMessage{
    sender:string | ObjectId;
    content:string;
    chatType:'individual' | 'group';
    chatId:string | ObjectId;
}

export interface IMessageResponse extends IMessage{
    _id:string,
    createdAt:string | Date,
}