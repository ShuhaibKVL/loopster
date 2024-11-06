import { Request , Response } from "express";
import { IReportManagementService } from "../../interfaces/admin/reportManagement/IReportMangementService";
import { HttpStatus } from "../../enums/httpStatus";

export class ReportManagementController{
    constructor(
        private reportManagementService : IReportManagementService
    ){}

    async getAllReports(req:Request,res:Response):Promise<unknown>{
        try {
            const response = await this.reportManagementService.getAllReports()
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'fialed to load the report collection'})
            }
            console.log('response :',response)
            res.status(HttpStatus.OK).json({message:"Success",data:response})
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message})
        }
        return
    }

    async markAsRead(req:Request,res:Response):Promise<unknown>{
        console.log('mark as read controller on report controller')
        try {
            const reportId = req.query.reportId
            console.log('reportId :',reportId)
            if(!reportId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Post id is missing..!'})
                return
            }
            const response = await this.reportManagementService.updateIsRead(reportId as string)
            console.log('response :',response)
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'fialed to load the report collection'})
                return
            }
            
            res.status(HttpStatus.OK).json({message:"Report mark as readed successfully"})
            return
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message})
        }
        return
    }
}