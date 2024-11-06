import mongoose , { Schema}from 'mongoose'

export interface IBookMark{
    userId:string,
    postId:string
}

const LikeScema : Schema = new mongoose.Schema<IBookMark>({
    userId:{
        type:String,
        required:true,
    },
    postId:{
        type:String,
        required:true
    }
},{timestamps:true})

const Bookmark = mongoose.model<IBookMark>('Bookmark',LikeScema)
export default Bookmark
