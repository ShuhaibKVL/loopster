import { Request,Response } from "express";
import { IFollowService } from "../interfaces/follow/IFollowService";
import { HttpStatus } from "../enums/httpStatus";
import { INotificationService } from "../interfaces/notification/INotificationService";
import { INotification } from "../models/notification";
import { IFollow, IFollowResponse } from "../models/followCollectionModal";
import { IUserService } from "../interfaces/IUserService";
import { IUser } from "../models/userModel";
import { ObjectId } from "mongoose";

export default class FollowController {
    constructor(
        private followService:IFollowService,
        private notificationService : INotificationService,
        private userService : IUserService
    ){}

    async follow(req:Request,res:Response){
        try {
            let newFollowDoc: IFollow = req.body

            // check it it a private account
            const followingUser =await this.userService.findUserById(newFollowDoc?.following.toString())
            console.log('following user data :',followingUser)

            const { isPrivateAccount } = followingUser[0] as IUser
            console.log('is private account :',isPrivateAccount)
            // if private account, update the follow doc
            if(isPrivateAccount){
                newFollowDoc.isRequestPending = true
            }

             // create a new follow doc
             const response = await this.followService.follow(newFollowDoc)
             console.log('follow response :',response)
             if(!response){
                 res.status(HttpStatus.BAD_REQUEST).json({message:'failed to follow,Try again.'})
             }

            // if private account, createa request to following user
            if(isPrivateAccount){
                console.log('if')

                const newNotification : INotification = {
                    senderId:newFollowDoc?.following.toString(),
                    userId:newFollowDoc?.follower.toString(),
                    followId:response?._id,
                    type:'follow-request',
                    message:'follow request',
                } 
                await this.notificationService.create(newNotification)
                res.status(HttpStatus.CREATED).json({message:'follow request forward to user.'})
                return
            }else{
                console.log('else')
                console.log('newFollowDoc :',newFollowDoc)
                // once follow doc created , create a notification
                const newNotification : INotification = {
                    senderId:newFollowDoc?.following.toString(),
                    userId:newFollowDoc?.follower.toString(),
                    type:'follow',
                    message:'followed you',
                }

                await this.notificationService.create(newNotification)
                res.status(HttpStatus.CREATED).json({message:'followed successfully'})
            }
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
    // accept the follow request by private account
    async acceptFollowRequest(req:Request,res:Response):Promise<unknown>{
        try {
            const { followId ,notificationId} = req.query
            console.log('followers :',followId)
            if(!followId && !notificationId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'followId /notificationId missng..!',status:false})
                return false
            }
            const update = await this.followService.AcceptFollowRequest(followId as string)
            console.log('follow request updated  :',update)
            if(!update){
                res.status(HttpStatus.BAD_REQUEST).json({message:'followId missng..!',status:false})
                return false
            }
            // if a follow request accepted/ remove it from notifications
            const removeNotifications = this.notificationService.deleteById(notificationId as string)
            console.log('removeNotifications :',removeNotifications)
            res.status(HttpStatus.OK).json({data:update,status:true})

        } catch (error) {
            console.log(error)
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to accept follow request',status:false})
        }
    }
    // reject / cancle the follow request by private account user
    async cancelFollow(req:Request,res:Response):Promise<unknown>{
        try {
            const { followId ,notificationId} = req.query
            console.log('delte followe by id :',followId)
            if(!followId && !notificationId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'followId / notificationId missng..!',status:false})
                return false
            }
            const deletFollow = await this.followService.deleteById(followId as string)
            console.log('followe :',deletFollow,)
            if(!deletFollow){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'followId missng..!',status:false})
                return false
            }
            // if a follow request accepted/ remove it from notifications
            const removeNotifications = this.notificationService.deleteById(notificationId as string)
            console.log('removeNotifications :',removeNotifications)
            res.status(HttpStatus.OK).json({data:deletFollow,status:true})

        } catch (error) {
            console.log(error)
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to fetch cancle the follow request.',status:false})
        }
    }
    // cancle the request of follow by requested user
    async cancleFollowRequest(req:Request , res:Response) {
        try {
            let deleteDoc = req.body as IFollow
            console.log('inside the cancle follow Request :',deleteDoc)

            // deleting the follow doc by matching the exact data// so need to to update
            deleteDoc.isRequestPending = true

            if(!deleteDoc){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'deleteDoc missng..!',status:false})
                return false
            }
            // for getting the follow id - for deleting the notification
            const follow = await this.followService.findByDoc(deleteDoc) as IFollowResponse
            console.log('follow doc found :',follow)
            if(follow){
                console.log('follow doc not find to get the follow id for notification delete')
            }
            
            const response = await this.followService.unFollow(deleteDoc)
            console.log('delete follow response :',response)
            
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'failed to cancle follow request,Try again.'})
            }
            console.log('delete doc :',deleteDoc,follow?._id?.toString())
            
            const notification : INotification = {
                senderId:deleteDoc?.following.toString(),
                userId:deleteDoc?.follower.toString(),
                followId:follow?._id,
                type:'follow-request',
                message:'follow request',
            } 
            console.log('delete notification :',notification)

            const deleteNotification = await this.notificationService.deleteByDoc(notification)
            console.log('delete notification :',deleteNotification)

            res.status(HttpStatus.CREATED).json({message:'cancled the follow request successfully'})
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }


    
}