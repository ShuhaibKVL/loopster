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
}