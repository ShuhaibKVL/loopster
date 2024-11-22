import { IMessageRepository } from "../../interfaces/message/IMessageRepository";
import { IMessageService } from "../../interfaces/message/IMessageService";
import { IMessage } from "../../models/message";

export class MessageService implements IMessageService{
    constructor(
        private messageRepository : IMessageRepository
    ){}

    async create(newMessage: IMessage): Promise<unknown> {
        return await this.messageRepository.create(newMessage)
    }

    async findMessages(chatId: string): Promise<unknown> {
        return await this.messageRepository.findMessages(chatId)
    }

    async unReadMessagesPerChat(userId: string): Promise<unknown> {
        return await this.messageRepository.unReadMessagesPerChat(userId)
    }

    async totalUnReadMessages(userId: string): Promise<unknown> {
        return await this.messageRepository.totalUnReadMessages(userId)
    }

    async markMsgAsReaded(userId: string, messageIds: string[]): Promise<unknown> {
        return await this.messageRepository.markMsgAsReaded(userId,messageIds)
    }
}