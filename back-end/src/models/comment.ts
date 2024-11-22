import mongoose , { ObjectId , Schema} from "mongoose";

export interface IComment extends Document{
    postId:ObjectId,
    userId:ObjectId,
    comment:string,
    likes?:ObjectId[]
}

const commentSchema : Schema = new mongoose.Schema<IComment>({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    likes:{
        type:Array
    }
},{timestamps:true})

const Comment = mongoose.model<IComment>('Comment',commentSchema)
export default Comment