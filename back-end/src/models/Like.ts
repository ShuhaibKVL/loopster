import mongoose , { ObjectId, Schema}from 'mongoose'

export interface ILike{
    userId:string,
    postId:string
}

const LikeScema : Schema = new mongoose.Schema<ILike>({
    userId:{
        type:String,
        required:true,
    },
    postId:{
        type:String,
        required:true
    }
},{timestamps:true})

const Like = mongoose.model<ILike>('Likes',LikeScema)
export default Like