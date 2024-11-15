import { IChat } from "../../models/chat";

export interface IChatRepository{
    create(newChat:IChat):Promise<unknown>
    fetchAllChats(currentUserId:string):Promise<unknown>
    fetchChat(chatId:string):Promise<unknown>
    updateLatestMessage(chatId:string,messageId:string):Promise<unknown>
}