import { ObjectId } from "mongoose";

export interface IChatBotHistory{
    content:string,
    question:string,
    userId:ObjectId,
    createdAt:string,
    _id:string
}