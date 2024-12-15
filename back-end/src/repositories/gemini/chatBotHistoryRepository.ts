import { IChatBotHistoryRepository } from "../../interfaces/gemini/storeChat/IChatBotHistoryRepository";
import ChatBotHistory from "../../models/chatBoatHistory";

export class ChatBotHistoryRepository implements IChatBotHistoryRepository{
    async create(userId: string, content: string,question:string): Promise<unknown> {
        return await ChatBotHistory.create({userId:userId,content:content,question:question})
    }

    async fetch(userId: string): Promise<unknown> {
        return await ChatBotHistory.find({userId:userId}).sort({createdAt:-1})
    }
}