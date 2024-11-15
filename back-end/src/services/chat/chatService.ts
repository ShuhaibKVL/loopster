import { IChatRepository } from "../../interfaces/chat/IChatRepository";
import { IChatService } from "../../interfaces/chat/IChatService";
import { IChat } from "../../models/chat";

export class ChatService implements IChatService{
    constructor(
        private chatRepository : IChatRepository
    ){}

    async create(newChat: IChat): Promise<{status:boolean} | unknown> {
        return await this.chatRepository.create(newChat)
    }

    async fetchAllChats(currentUserId: string): Promise<unknown> {
        return await this.chatRepository.fetchAllChats(currentUserId)
    }

    async updateLatestMessage(chatId: string, messageId: string): Promise<unknown> {
        return await this.chatRepository.updateLatestMessage(chatId,messageId)
    }
}
