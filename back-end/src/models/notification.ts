import mongoose, { mongo, ObjectId, Schema } from "mongoose";

export interface INotification{
    senderId:string; // the target user
    userId:string; // who take action
    type:'post' | 'comment' | 'follow';
    message:'post liked' | 'followed you' | 'unfollowed you' | 'liked your comment' | 'commented on your post';
    postId?:string;
    commentId?:string;
    isRead?:boolean
}


export interface INotificationModel extends Document{
    senderId:ObjectId; // the target user
    userId:ObjectId; // who take action
    type:'post' | 'comment' | 'follow';
    message:'post liked' | 'followed you' | 'unfollowed you' | 'liked your comment' | 'commented on your post';
    postId?:ObjectId;
    commentId?:ObjectId;
    isRead?:boolean
}

const notificationSchema : Schema = new mongoose.Schema<INotificationModel>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:['post' , 'comment' , 'follow'],
        required:true
    },
    message:{
        type:String,
        enum:['post liked' , 'followed you' , 'unfollowed you' , 'liked your comment' , 'commented on your post'],
        required:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Notification = mongoose.model<INotificationModel>('Notification',notificationSchema)
export default Notification