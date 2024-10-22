import mongoose, { ObjectId, Schema } from "mongoose";

export interface IFollow extends Document{
    follower:ObjectId,
    following:ObjectId,
}

const followSchema : Schema = new mongoose.Schema<IFollow>({
    follower:{
        type:mongoose.Schema.Types.ObjectId ,
        required:true
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        required:true   
    }
},{timestamps:true})

const Follow = mongoose.model<IFollow>('Follow',followSchema)

export default Follow