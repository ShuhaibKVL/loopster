import mongoose ,{Schema}from "mongoose";


export interface IOtp extends Document {
    email:string,
    otp:string,
    expiresAt:Date,
    createdAt:Date
}

const otpSchema : Schema = new mongoose.Schema<IOtp>({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true,
        default:Date.now,
        expires:120
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Otp = mongoose.model<IOtp>('Otp',otpSchema)

export default Otp