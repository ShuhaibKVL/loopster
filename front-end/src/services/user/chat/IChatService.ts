import { IChat, IChatResponse } from "@/lib/utils/interfaces/IChat";

export interface IChatService{
    create(newChat : IChat):Promise<{status:boolean,message:string}>
    fetchALlChats(currentUserId:string):Promise<{status:boolean,message:string,chats:IChatResponse[]}>
}