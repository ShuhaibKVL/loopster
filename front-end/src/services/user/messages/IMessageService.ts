import { IMessage } from "@/lib/utils/interfaces/iMessages"


export interface IMessageService{
    create(newMessage:IMessage):Promise<unknown>
    findMessages(chatId:string):Promise<unknown>
    delteFromMe(messageId:string,userId:string):Promise<unknown>
    deleteFromEveryone(messageId:string):Promise<unknown>
}