import mongoose , {Schema} from 'mongoose'

export interface IPost extends Document{
    userId:string,
    content:string,
    mediaType:"none" | "video" | "img",
    mediaUrl?:string,
}

const PostSchema : Schema = new mongoose.Schema<IPost>({
    userId:{type:String,required:true},
    content:{type:String,required:true},
    mediaType:{type:String ,default:'none'},
    mediaUrl:{type:String}
},{timestamps:true})

PostSchema.pre('save',function(next) {
    if(this.mediaType !== 'none' && !this.mediaUrl){
        return next(new Error('MediaUrl is required when mediaType is note "none".'))
    }
    next()
})

const Post = mongoose.model<IPost>('Post',PostSchema)
export default Post

