import { IChat } from "../../models/chat";

export interface IChatService{
    create(newChat:IChat):Promise<{status:boolean} | unknown>
    fetchAllChats(currentUserId:string):Promise<unknown>
    updateLatestMessage(chatId:string,messageId:string):Promise<unknown>
}