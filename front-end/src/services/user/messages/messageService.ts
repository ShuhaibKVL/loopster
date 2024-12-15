import { IMessage, IMessageResponse } from "@/lib/utils/interfaces/iMessages";
import { IMessageService } from "./IMessageService";
import { chatApi } from "@/services/apis/axiosInstance";

export class MessageService implements IMessageService{
    async create(newMessage: IMessage): Promise<unknown> {
        const res = await chatApi.post('/message/create',newMessage)
        return res?.data
    }

    async findMessages(chatId: string): Promise<{messages:string,status:boolean,chats:IMessageResponse[]}> {
        const res = await chatApi.get(`/message/fetch-messages?chatId=${chatId}`)
        return res?.data
    }

    async delteFromMe(messageId: string, userId: string): Promise<{status:boolean,message:string,deletedMsg?:IMessageResponse}> {
        const res = await chatApi.delete(`/message/delet-from-me?messageId=${messageId}&userId=${userId}`)
        return res?.data
    }

    async deleteFromEveryone(messageId: string): Promise<{status:boolean,message:string,messageId?:string}> {
        const res = await chatApi.delete(`/message/delete-from-everyone?messageId=${messageId}`)
        return res?.data
    }
}

const messageService = new MessageService()
export default messageService