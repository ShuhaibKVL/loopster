import { Request, Response} from 'express'
import { HttpStatus } from '../../enums/httpStatus'
import { IChatService } from '../../interfaces/chat/IChatService'
import { IChat } from '../../models/chat'
import { IMessageService } from '../../interfaces/message/IMessageService'

export class ChatController{
    constructor(
        private chatService : IChatService,
        private messageService : IMessageService
    ){}

    async createChat(req:Request,res:Response):Promise<unknown>{
        try {
            console.log('body :',req.body)
            const newChat = req.body
            console.log('new chat in controller :',newChat)
            if(!newChat){
                res.status(HttpStatus.BAD_REQUEST).json({message:'new chat data is missing',status:false})
                return
            }
            const createChat = await this.chatService.create(newChat)
            console.log('create chat response in controller :',createChat)

            if(!createChat){
                res.status(HttpStatus.BAD_REQUEST).json({message:'The chat is all ready exist',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"chat created successfully",newChat:createChat,status:true})
        } catch (error:any) {
            console.log('error :',error)
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

    async fetchAllChats(req:Request,res:Response):Promise<unknown>{
        try {
            const {currentUserId} = req.query
            if(!currentUserId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'chatId is missing',status:false})
                return
            }
            const chats = await this.chatService.fetchAllChats(currentUserId as string)
            if(!chats){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to fetch chats',status:false})
                return
            }
            const unReadMsgPerChat = await this.messageService.unReadMessagesPerChat(currentUserId as string)
            console.log('unReadMsgPerChat :',unReadMsgPerChat)

            res.status(HttpStatus.CREATED).json({message:"chats fetched successfully",chats:chats,unReadMsgPerChat:unReadMsgPerChat,status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }
}