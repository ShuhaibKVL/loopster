import mongoose from "mongoose";
import { IChatRepository } from "../../interfaces/chat/IChatRepository";
import Chat, { IChat } from "../../models/chat";

export class ChatRepository implements IChatRepository{

    async create(newChat: IChat): Promise<unknown> {
        const usersId = newChat?.users
        const isExist = await Chat.findOne({users:{$all:usersId},isGroupChat:false})
        if(isExist){
            console.log('all ready existed')
            return isExist
        }
        return await Chat.create(newChat)
    }

    async fetchAllChats(currentUserId: string): Promise<unknown> {
        return await Chat.aggregate([
            { $match: { users: { $in: [new mongoose.Types.ObjectId(currentUserId)] } } },
            {
                $lookup: {
                  from: 'users', // Replace with your actual User collection name
                  localField: 'users',
                  foreignField: '_id',
                  as: 'users', // Populated user data
                },
              },
            {
              $lookup: {
                from: 'messages', // Replace with your actual Message collection name
                localField: '_id',
                foreignField: 'chatId',
                as: 'messages',
              },
            },
            {
              $addFields: {
                latestMessage: { $arrayElemAt: ['$messages', -1] }, // Get the last message
              },
            },
            {$project:{
                messages:0,
                'latestMessage._id' : 0,
                'latestMessage.sender' : 0,
                'latestMessage.chatType' : 0,
                'latestMessage.chatId' : 0,
                'latestMessage.updatedAt' : 0,
                'latestMessage.isRead' : 0,
            }}
          ]);
    }

    async fetchChat(chatId: string): Promise<unknown> {
        return await Chat.findById(chatId)
    }

    async updateLatestMessage(chatId: string, messageId: string): Promise<unknown> {
        return await Chat.findByIdAndUpdate(chatId,{latestMessage:messageId},{new:true})
    }
}