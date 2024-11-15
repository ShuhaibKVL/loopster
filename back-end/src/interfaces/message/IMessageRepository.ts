import { IMessage } from "../../models/message";

export interface IMessageRepository{
    create(newMessage:IMessage):Promise<unknown>
    findMessages(chatId:string):Promise<unknown>
}