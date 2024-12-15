import mongoose , { ObjectId, Schema} from "mongoose";

export interface ColorTheme{
    theme:"bg-gradient-to-r from-gray-100 via-gray-300 to-gray-200"| "bg-gradient-to-b from-white via-blue-100 to-blue-50" |
     "bg-gradient-to-r from-green-50 via-teal-100 to-blue-50" | "bg-gradient-to-bl from-pink-50 via-red-100 to-yellow-50" |
     "bg-gradient-to-r from-indigo-50 via-purple-100 to-pink-50" | "bg-gradient-to-tl from-yellow-100 via-orange-200 to-red-100" |
     'bg-black' | 'bg-white'
}

export interface IStory{
    color:ColorTheme;
    note:string;
    userId:ObjectId;
    isReaded?:ObjectId[]
}

const StorySchema : Schema = new mongoose.Schema<IStory>({
    color:{
        type:String,
        required:true
    },
    note:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isReaded:{
        type:Array
    }
},{timestamps:true})

// Add a TTL index to the `createdAt` field (expire after 1 day)
StorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });


const Story = mongoose.model<IStory>('Story',StorySchema)
export default Story