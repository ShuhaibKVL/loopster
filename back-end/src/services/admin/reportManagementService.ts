import { ClientSession } from "mongoose";
import { IReportManagementRepository } from "../../interfaces/admin/reportManagement/IReportManagementRepository";
import { IReportManagementService } from "../../interfaces/admin/reportManagement/IReportMangementService";

export class ReportManagementService implements IReportManagementService{
    constructor(
        private reportManagementRepository : IReportManagementRepository
    ){}

    async getAllReports(): Promise<unknown> {
        return await this.reportManagementRepository.fetchReports()
    }

    async updateIsRead(postId: string,session?:ClientSession): Promise<unknown> {
        return await this.reportManagementRepository.updateIsReport(postId,session)
    }
    
}