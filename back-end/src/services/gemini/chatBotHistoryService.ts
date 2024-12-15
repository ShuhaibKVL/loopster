import { IChatBotHistoryRepository } from "../../interfaces/gemini/storeChat/IChatBotHistoryRepository";
import { IChatBotSHistoryervice } from "../../interfaces/gemini/storeChat/IChatBotHistoryService";

export class ChatBotHistoryService implements IChatBotSHistoryervice{
    constructor(
        private chatBotHistoryRepository : IChatBotHistoryRepository
    ){}

    async create(userId: string, content: string,question:string): Promise<unknown> {
        return await this.chatBotHistoryRepository.create(userId,content,question)
    }

    async fetch(userId: string): Promise<unknown> {
        return await this.chatBotHistoryRepository.fetch(userId)
    }
}