import { ClientSession } from "mongoose"

export interface IReportManagementService{
    getAllReports():Promise<unknown>
    updateIsRead(postId:string,session?:ClientSession):Promise<unknown>
}