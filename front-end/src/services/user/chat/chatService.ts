import { IChat, IChatResponse } from "@/lib/utils/interfaces/IChat";
import { IChatService } from "./IChatService";
import { chatApi } from "@/services/apis/axiosInstance";
import { ObjectId } from "mongoose";

export class ChatService implements IChatService{

    async create(newChat: IChat): Promise<{ status: boolean; message: string; }> {
        const response = await chatApi.post('/create',newChat)
        return response?.data
    }

    async fetchALlChats(currentUserId: string): Promise<{ status: boolean; message: string; chats: IChatResponse[]; unReadMsgPerChat:{ _id: ObjectId, unReadMsg: number }[] }> {
        const response = await chatApi.get(`/get-all-chats?currentUserId=${currentUserId}`)
        return response?.data
    }
}

const chatService = new ChatService()
export default chatService