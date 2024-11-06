import { ClientSession } from "mongoose"

export interface IReportManagementRepository{
    fetchReports():Promise<unknown>
    updateIsReport(postId:string,session?:ClientSession):Promise<unknown>
}