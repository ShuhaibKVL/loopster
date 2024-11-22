import mongoose , {Schema} from 'mongoose'

export interface IPost extends Document{
    _id?:string,
    userId:string,
    content?:string,
    mediaType:"none" | "video" | "image",
    mediaUrl?:string,
    isList?:boolean,
    isReported?:boolean
}

const PostSchema : Schema = new mongoose.Schema<IPost>({
    userId:{type:String,required:true},
    content:{type:String},
    mediaType:{type:String ,default:'none'},
    mediaUrl:{type:String},
    isList:{type:Boolean,default:true},
    isReported:{type:Boolean,default:false}
},{timestamps:true})

PostSchema.pre('save',function(next) {
    if(this.mediaType !== 'none' && !this.mediaUrl){
        return next(new Error('MediaUrl is required when mediaType is note "none".'))
    }
    next()
})

const Post = mongoose.model<IPost>('Post',PostSchema)
export default Post

