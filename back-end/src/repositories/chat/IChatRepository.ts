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
        return await Chat.find({
            users: { $in: [currentUserId] }
            }).populate('users', 'userName _id fullName profileImage') // Adjust as needed for user fields
          .populate('latestMessage')
          .populate({
              path: 'latestMessage.sender',
              select: 'username email', // Adjust as needed
        });
    }

    async fetchChat(chatId: string): Promise<unknown> {
        return await Chat.findById(chatId)
    }

    async updateLatestMessage(chatId: string, messageId: string): Promise<unknown> {
        return await Chat.findByIdAndUpdate(chatId,{latestMessage:messageId},{new:true})
    }
}