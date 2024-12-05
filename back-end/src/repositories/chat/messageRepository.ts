import { ObjectId } from "mongoose";
import { IMessageRepository } from "../../interfaces/message/IMessageRepository";
import { IMessage, IMessageResponse, Message } from "../../models/message";

export class MessageRepository implements IMessageRepository{

    async create(newMessage: IMessage): Promise<unknown> {
        const savedMessage =  await Message.create(newMessage)
        return await Message.findById(savedMessage?._id).populate('sender', 'userName').exec();
    }

    async findMessages(chatId: string): Promise<unknown> {
        return await Message.find({chatId:chatId}).populate('sender', 'userName')
        .exec();
    }

    async unReadMessagesPerChat(userId: string): Promise<unknown> {
        try {
            const unreadMessages = await Message.aggregate([
                {$match:{
                    isRead:{$ne:userId}
                }},
                {$group:{
                    _id:'$chatId',
                    unReadMsg:{$sum:1}
                }}
            ])
            console.log('unReaded messages :',unreadMessages)
            return unreadMessages
        } catch (error) {
            console.log(error)
        }
    }

    async totalUnReadMessages(userId: string): Promise<unknown> {
        console.log('userId inside totalUnreadMessage Repo :',userId)
        return await Message.countDocuments({
            isRead:{$ne:userId}
        })
    }

    async markMsgAsReaded(userId: string, messageIds: string[]): Promise<unknown> {
        try {
            const update = await Message.updateMany(
                {_id:{$in:messageIds}},
                {$push:{isRead:userId}}
            )
            console.log('updatedddd :',update)
            return update
        } catch (error) {
            console.log(error)
        }
    }

    async deleteFromMe(messageId: string, userId: string): Promise<unknown> {
        return await Message.findByIdAndUpdate(
            messageId,
            {$push:{deleteFromMe:userId}}
        )
    }

    async deleteFromEveryOne(messageId: string): Promise<unknown> {
        return await Message.findByIdAndDelete(messageId)
    }
}