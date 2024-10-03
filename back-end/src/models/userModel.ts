import mongoose ,{Document , ObjectId, Schema} from 'mongoose'
import bcrypt from 'bcryptjs'

// Define the User Interface
export interface IUser extends Document {
    _id:ObjectId,
    fullName:string,
    userName:string,
    email:string,
    password:string,
    isList?:boolean,
    isBlocked?:boolean,
    isVerified?:boolean
}

const userSchema = new mongoose.Schema({
    fullName:{type:String,required:true},
    userName:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isList:{type:Boolean,default:true},
    isBlocked:{type:Boolean,default:false},
    isVerified:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now}
},{timestamps:true})

userSchema.pre<IUser>('save',async function(next) {
    if(this.isModified('password') || this.isNew){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
    }
    next()
})

const User = mongoose.model<IUser>('User',userSchema);
export default User;
