import { ObjectId } from "mongoose";

export interface INotification{
    senderId:ObjectId;
    userId:ObjectId;
    type:'post' | 'comment' | 'follow' |'follow-request';
    message:'post liked' | 'followed you' | 'unfollowed you' | 'liked your comment' | 'commented on your post' | 'follow request';
    postId?:ObjectId;
    commentId?:ObjectId;
    followId?:ObjectId;
    isRead:boolean
}

export interface INotificationResponse{
    _id:ObjectId | string,
    senderId:{_id:string,userName:string,profileImage:string};
    userId:{_id:string,userName:string,profileImage:string};
    type:'post' | 'comment' | 'follow' | 'follow-request';
    message:'post liked' | 'followed you' | 'unfollowed you' | 'liked your comment' | 'commented on your post' | 'follow request';
    postId?:{content:string,mediaType:string,_id:string,mediaUrl:"none" | "video" | "image"};
    commentId?:{comment:string,postId:string};
    followId?:ObjectId;
    isRead:boolean
    createdAt:string | Date
}