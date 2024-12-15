export interface IReportService{
    fetchReports():Promise<unknown>
    markAsReaded(reportId:string):Promise<unknown>
}