import mongoose, { mongo, ObjectId, Schema } from "mongoose";

export interface INotification{
    senderId:string; // the target user
    userId:string; // who take action
    type:'post' | 'comment' | 'follow' |'follow-request';
    message:'post liked' | 'followed you' | 'unfollowed you' | 'liked your comment' | 'commented on your post' | 'follow request';
    postId?:string;
    commentId?:string;
    followId?:string | ObjectId;
    isRead?:boolean;
}


export interface INotificationModel extends Document{
    senderId:ObjectId; // the target user
    userId:ObjectId; // who take action
    type:'post' | 'comment' | 'follow' | 'follow-request';
    message:'post liked' | 'followed you' | 'unfollowed you' | 'liked your comment' | 'commented on your post' | 'follow request';
    postId?:ObjectId;
    commentId?:ObjectId;
    followId?:ObjectId;
    isRead?:boolean;
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
        enum:['post' , 'comment' , 'follow','follow-request'],
        required:true
    },
    message:{
        type:String,
        enum:['post liked' , 'followed you' , 'unfollowed you' , 'liked your comment' , 'commented on your post','follow request'],
        required:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    followId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Follow'
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