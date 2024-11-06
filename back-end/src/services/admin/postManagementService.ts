import { ClientSession } from "mongoose";
import { IPostManagementRepository } from "../../interfaces/admin/postManagement/IPostManagementRepository";
import { IPostManagementService } from "../../interfaces/admin/postManagement/IPostManagementService";
import { IReportManagementRepository } from "../../interfaces/admin/reportManagement/IReportManagementRepository";

export class PostManagementService implements IPostManagementService {
    constructor(
        private postMangementRepository : IPostManagementRepository,
        private reportManagementRepository : IReportManagementRepository
    ){}

    async getAllPosts(page:number): Promise<any> {
        return await this.postMangementRepository.fetchAllPosts(page)
    }

    async listUnList(postId: string): Promise<unknown> {
        return await this.postMangementRepository.updateList(postId)
    }

    async updateIsReport(postId: string,reportId:string,session?:ClientSession): Promise<unknown> {
        console.log('update is report service',postId,":",reportId)
        const updateIsReport = await this.postMangementRepository.updateIsReport(postId)
        console.log('udateReport :',updateIsReport)
        if(!updateIsReport){
            return false
        }
        const markAsReaded = await this.reportManagementRepository.updateIsReport(reportId)
        console.log('markAsReaded :',markAsReaded)
        return markAsReaded
    }
}