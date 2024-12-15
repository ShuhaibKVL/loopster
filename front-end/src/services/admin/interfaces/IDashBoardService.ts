import { IChartDataPosts, IChartDataUsers } from "../dashboardService";

export interface IDashBoardService{
    getChartData():Promise<{status: boolean; message: string; data:{users:IChartDataUsers[],posts:IChartDataPosts[]}}>
}