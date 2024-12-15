import { Request , Response } from 'express'
import { IMessageService } from '../../interfaces/message/IMessageService';
import { HttpStatus } from '../../enums/httpStatus';

export class MessageController{
    constructor(
        private messageService : IMessageService
    ){}

    async createMessage(req:Request,res:Response):Promise<unknown>{
        try {
            const newMessage = req.body
            if(!newMessage){
                res.status(HttpStatus.BAD_REQUEST).json({message:'chatId is missing',status:false})
                return
            }
            const chats = await this.messageService.create(newMessage)

            if(!chats){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to create message',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"messsage created successfully",chats:chats,status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

    async fetchMessages(req:Request,res:Response):Promise<unknown>{
        try {
            const { chatId } = req.query
            if(!chatId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'chatId is missing',status:false})
                return
            }
            const chats = await this.messageService.findMessages(chatId as string)

            if(!chats){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to fetch messages',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"messages fetched successfully",chats:chats,status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

    async delteFrom_me(req:Request,res:Response):Promise<unknown>{
        try {
            const { messageId,userId } = req.query
            if(!messageId && !userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'messageId and userId is missing',status:false})
                return
            }
            const deleteMsg = await this.messageService.deleteFromMe(messageId as string,userId as string)

            if(!deleteMsg){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to delete message from me',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"message delte from me successfully",deletedMsg:deleteMsg,status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

    async delteFrom_everyOne(req:Request,res:Response):Promise<unknown>{
        try {
            const { messageId } = req.query
            if(!messageId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'messageId and userId is missing',status:false})
                return
            }
            const deleteMsg = await this.messageService.deleteFromEveryOne(messageId as string)

            if(!deleteMsg){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to delete message from every ones',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"message delte from every one successfully",messageId:messageId,status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

    

}