import mongoose , { Schema} from "mongoose";
import { boolean, string } from "yup";

export interface IReportType{
    reportType:'I just dont like it.' | 'Bullying or unwanted contact' | 'Violence,hate or exploitation' | 'Nudity or sexual activity' | 'Scam, fraud or spam' | 'False information'
}

export interface IReport{
    postId:string
    userId:string
    reportType:IReportType,
    isRead?:boolean
}

const reportSchema : Schema = new mongoose.Schema<IReport>({
    postId:{type:String,required:true},
    userId:{type:String,required:true},
    reportType:{type:String,required:true},
    isRead:{type:Boolean,default:false}
},{timestamps:true})

const Report = mongoose.model<IReport>('Report',reportSchema)
export default Report

