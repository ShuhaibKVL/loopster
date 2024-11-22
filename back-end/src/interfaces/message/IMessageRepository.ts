import { IMessage } from "../../models/message";

export interface IMessageRepository{
    create(newMessage:IMessage):Promise<unknown>
    findMessages(chatId:string):Promise<unknown>
    unReadMessagesPerChat(userId:string):Promise<unknown>
    totalUnReadMessages(userId:string):Promise<unknown>
    markMsgAsReaded(userId:string,messageIds:string[]):Promise<unknown>
}