import mongoose, { ObjectId, Schema } from "mongoose";

export interface IFollow extends Document{
    follower:ObjectId; // who take the action / logined user
    following:ObjectId;
    isRequestPending?:boolean;
}

export interface  IFollowResponse extends IFollow{
    _id:ObjectId
}

const followSchema : Schema = new mongoose.Schema<IFollow>({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true  
    },
    isRequestPending:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const Follow = mongoose.model<IFollow>('Follow',followSchema)

export default Follow