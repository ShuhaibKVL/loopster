import { IMessage } from "@/lib/utils/interfaces/iMessages"


export interface IMessageService{
    create(newMessage:IMessage):Promise<unknown>
    findMessages(chatId:string):Promise<unknown>
}