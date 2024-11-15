import { ObjectId } from "mongoose";

export interface IChat{
    chatName?:string,
    isGroupChat:boolean,
    users:string[],
    latestMessage?:ObjectId,
    groupAdmin?:ObjectId,
    groupImage?:string
}

export interface IChatResponse{
    _id:string,
    chatName?:string,
    isGroupChat:boolean,
    latestMessage?:ObjectId,
    groupImage?:string,
    groupAdmin?:ObjectId,
    users:[
        {userName:string,fullName:string,profileImage:string,_id:string}
    ]
    createdAt:string
}