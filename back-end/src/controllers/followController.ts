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

    // to get followed users on profile
    async getFollowedUsers(req:Request , res:Response) {
        try {
            const { userId } = req.query
            console.log('get followed users :',userId)
            if(!userId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId missng..!',status:false})
                return false
            }
            const followedUsers = await this.followService.findFollowedUsers(userId as string)
            console.log('followed :',followedUsers,userId)
            if(!followedUsers){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId missng..!',status:false})
                return false
            }
            res.status(HttpStatus.OK).json({data:followedUsers,status:true})

        } catch (error) {
            console.log(error)
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to fetch latest users',status:false})
        }
    }

    // to get followers on profile
    async getFollowers(req:Request , res:Response) {
        try {
            const { userId } = req.query
            console.log('followers :',userId)
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'userId missng..!',status:false})
                return false
            }
            const followers = await this.followService.findFollowers(userId as string)
            console.log('followers :',followers,userId)
            if(!followers){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId missng..!',status:false})
                return false
            }
            res.status(HttpStatus.OK).json({data:followers,status:true})
        } catch (error) {
            console.log(error)
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to fetch latest users',status:false})
        }
    }

    // to get unFollowed users for sugggeston part
    async findUnFollowedUsers(req:Request , res:Response) {
        try {
            const { userId } = req.query
            console.log('followers :',userId)
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'userId missng..!',status:false})
                return false
            }
            const users = await this.followService.findUnFollowedUsers(userId as string)
            console.log('unfollowed users :',users,userId)
            if(!users){
                res.status(HttpStatus.BAD_REQUEST).json({message:'userId missng..!',status:false})
                return false
            }
            res.status(HttpStatus.OK).json({data:users,status:true})

        } catch (error) {
            console.log(error)
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to fetch latest users',status:false})
        }
    }

    // to get most followers users list
    async findMostFollowerUsers(req:Request , res:Response) {
        try {
            const users = await this.followService.findMostFollowersUsers()
            console.log('most followers users :',users)
            if(!users){
                res.status(HttpStatus.BAD_REQUEST).json({message:'failde to fetch users basis on followers !',status:false})
                return false
            }
            res.status(HttpStatus.OK).json({data:users,status:true})

        } catch (error) {
            console.log(error)
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to fetch latest users',status:false})
        }
    }


    
}