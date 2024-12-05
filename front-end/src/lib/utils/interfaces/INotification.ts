import { ObjectId } from "mongoose";

export interface INotification{
    senderId:ObjectId;
    userId:ObjectId;
    type:'post' | 'comment' | 'follow';
    message:'post liked' | 'followed you' | 'unfollowed you' | 'liked your comment' | 'commented on your post';
    postId?:ObjectId;
    commentId?:ObjectId;
    isRead:boolean
}

export interface INotificationResponse{
    _id:ObjectId,
    senderId:{_id:string,userName:string,profileImage:string};
    userId:{_id:string,userName:string,profileImage:string};
    type:'post' | 'comment' | 'follow';
    message:'post liked' | 'followed you' | 'unfollowed you' | 'liked your comment' | 'commented on your post';
    postId?:{content:string,mediaType:string,_id:string,mediaUrl:"none" | "video" | "image"};
    commentId?:{comment:string,postId:string};
    isRead:boolean
    createdAt:string | Date
}