import { Request, Response } from "express";
import { INotificationService } from "../../interfaces/notification/INotificationService";
import { HttpStatus } from "../../enums/httpStatus";

export class NotificationController{
    constructor(
        private notificationService : INotificationService
    ){}

    async fetchAllNotifications(req:Request,res:Response):Promise<unknown>{
        try {
            const { userId } = req.query
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'chatId is missing',status:false})
                return
            }
            const notifications = await this.notificationService.fetchAll(userId as string)
            if(!notifications){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to fetch notifications',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"notifications fetched successfully",notifications:notifications,status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

    async markAsReaded(req:Request,res:Response):Promise<unknown>{
        try {
            const { id } = req.query
            if(!id){
                res.status(HttpStatus.BAD_REQUEST).json({message:'id is missing',status:false})
                return
            }
            const update = await this.notificationService.markAsReaded(id as string)

            if(!update){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to fetch notifications',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"notifications fetched successfully",updated:update,status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }
}