import { Request,Response } from "express";
import { IFollowService } from "../interfaces/follow/IFollowService";
import { HttpStatus } from "../enums/httpStatus";
import { INotificationService } from "../interfaces/notification/INotificationService";
import { INotification } from "../models/notification";
import { IFollow } from "../models/followCollectionModal";

export default class FollowController {
    constructor(
        private followService:IFollowService,
        private notificationService : INotificationService
    ){}

    async follow(req:Request,res:Response){
        try {
            const newFollowDoc: IFollow = req.body
            const response = await this.followService.follow(newFollowDoc)
            console.log('follow response :',response)
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'failed to follow,Try again.'})
            }
            console.log('newFollowDoc :',newFollowDoc)
            const newNotification : INotification = {
                senderId:newFollowDoc?.following.toString(),
                userId:newFollowDoc?.follower.toString(),
                type:'follow',
                message:'followed you',
            }

            await this.notificationService.create(newNotification)
            res.status(HttpStatus.CREATED).json({message:'followed successfully'})
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async unFollow(req:Request , res:Response) {
        try {
            const deleteDoc = req.body
            const response = await this.followService.unFollow(deleteDoc)
            console.log('unfollow response :',response)
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'failed to unFollow,Try again.'})
            }
            console.log('delete doc :',deleteDoc)
            
            const newNotification : INotification = {
                senderId:deleteDoc?.following.toString(),
                userId:deleteDoc?.follower.toString(),
                type:'follow',
                message:'unfollowed you',
            }

            await this.notificationService.create(newNotification)

            res.status(HttpStatus.CREATED).json({message:'UnFollowed successfully'})
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }
}