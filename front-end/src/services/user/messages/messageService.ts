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
}

const messageService = new MessageService()
export default messageService