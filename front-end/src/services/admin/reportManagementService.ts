import { adminApi } from "../apis/axiosInstance";
import { IReportService } from "./interfaces/IReportService";

class ReportManagementService implements IReportService{

    async fetchReports(): Promise<{message:string,data:[]}> {
        const response = await adminApi.get('/post/new-reportes')
        return response.data
    }

    async markAsReaded(reportId: string): Promise<unknown> {
        const response = await adminApi.patch(`/post/report/mark-as-readed?reportId=${reportId}`)
        return response.data
    }
}

const reprtedManagementService = new ReportManagementService()
export default reprtedManagementService