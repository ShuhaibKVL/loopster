export interface IDashBoardService{
    getChartData():Promise<{status:boolean,message:string,data:{}}>
}