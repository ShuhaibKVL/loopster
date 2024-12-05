import { adminApi } from "../apis/axiosInstance";
import { IDashBoardService } from "./interfaces/IDashBoardService";
export interface IChartDataUsers{
    _id:string,
    users:number
}

export interface IChartDataPosts{
    _id:string,
    posts:number
}
export class DashboardService implements IDashBoardService{
    async getChartData(): Promise<{status: boolean; message: string; data:{users:IChartDataUsers[],posts:IChartDataPosts[]}}> {
        const response = await adminApi.get('/dashboard/chart-data')
        return response?.data
    }
}

const dashBoardService = new DashboardService()
export default dashBoardService