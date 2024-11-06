import { ClientSession } from "mongoose";
import { IReportManagementRepository } from "../../interfaces/admin/reportManagement/IReportManagementRepository";
import Report from "../../models/Report";

export class ReportManagementRepository implements IReportManagementRepository{

    async fetchReports(): Promise<unknown> {
        return await Report.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'postId',
                    foreignField: '_id',
                    as: 'post',
                    pipeline: [
                        { $match: { _id: { $exists: true } } } // Ensures _id is present for matching
                    ]
                }
            },
            {
                $addFields: { postIdObject: { $toObjectId: "$postId" } } // Converts postId to ObjectId in aggregation
            },
            {
                $lookup: {
                    from: 'posts',
                    localField: 'postIdObject',
                    foreignField: '_id',
                    as: 'post'
                }
            }
        ])        
    }

    async updateIsReport(postId: string,session?:ClientSession): Promise<unknown> {
        try {
            const report = await Report.findById(postId)
            if(report){
                if(!report.isRead){
                    report.isRead = !report?.isRead;
                }
                const update = await report.save()
                return true
            }
           return false
        } catch (error) {
            console.log(error)
        }
       
    }


}