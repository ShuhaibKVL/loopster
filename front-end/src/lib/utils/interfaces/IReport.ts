import { IPostResponse } from "./IPost"

export interface IReportType{
    reportType:'I just dont like it.' | 'Bullying or unwanted contact' | 'Violence,hate or exploitation' | 'Nudity or sexual activity' | 'Scam, fraud or spam' | 'False information'
}

export interface IReport{
    postId:string
    userId:string
    reportType:string,
}

export interface IReportResponse extends IReport{
    _id:string,
    createdAt:string,
    isRead:string
    post:IPostResponse []
}

export const reportTypes =[
    'I just dont like it.' ,
    'Bullying or unwanted contact' ,
    'Violence,hate or exploitation' ,
    'Nudity or sexual activity' ,
    'Scam, fraud or spam' ,
    'False information'
]
