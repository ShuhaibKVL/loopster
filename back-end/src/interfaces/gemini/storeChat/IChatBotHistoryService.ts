export interface IChatBotSHistoryervice{
    create(userId:string,content:string,question:string):Promise<unknown>
    fetch(userId:string):Promise<unknown>
}