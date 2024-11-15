import { IMessageRepository } from "../../interfaces/message/IMessageRepository";
import { IMessage, Message } from "../../models/message";

export class MessageRepository implements IMessageRepository{

    async create(newMessage: IMessage): Promise<unknown> {
        return await Message.create(newMessage)
    }

    async findMessages(chatId: string): Promise<unknown> {
        return await Message.find({chatId:chatId})
    }
}