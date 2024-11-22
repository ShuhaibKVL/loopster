import { ObjectId } from "mongoose";

export interface IChat{
    chatName?:string,
    isGroupChat:boolean,
    users:string[],
    latestMessage?:ObjectId,
    groupAdmin?:string,
    groupImage?:string
}

export interface IChatResponse{
    _id:string;
    chatName?:string,
    isGroupChat:boolean,
    groupImage?:string,
    groupAdmin?:string,
    users:[
        {userName:string,fullName:string,profileImage:string,_id:string}
    ],
    latestMessage?:{content:string}
    createdAt:string
}