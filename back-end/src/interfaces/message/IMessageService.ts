import { IMessage } from "../../models/message";

export interface IMessageService{
    create(newMessage:IMessage):Promise<unknown>
    findMessages(chatId:string):Promise<unknown>
}