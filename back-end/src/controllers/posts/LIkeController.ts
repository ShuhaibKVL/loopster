import { Request, Response } from "express";
import { ILikeService } from "../../interfaces/posts/likes/ILikeService";
import { HttpStatus } from "../../enums/httpStatus";
import { ILike } from "../../models/Like";
import { INotification } from "../../models/notification";
import mongoose from "mongoose";
import { IPostService } from "../../interfaces/posts/IPostServices";
import { IPost } from "../../models/Post";
import { INotificationService } from "../../interfaces/notification/INotificationService";

export class LikeController {
    constructor(
        private likeService : ILikeService,
        private postService : IPostService,
        private notificationService : INotificationService
    ){}

    async create_like(req:Request , res:Response) :Promise<unknown>{
        try {
            const { userId , postId } = req.query
            if(!userId && !postId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId and postId is missing',status:false})
                return
            }
            const data : ILike = {
                postId: postId as string,
                userId:userId as string
            }

            const response = await this.likeService.createLike(data)
            if(!response){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'failed to create like document.'})
                return
            }
            const post  = await this.postService.findPostById(postId as string)
            if(!post){
                console.log('Failed to fetch post')
            }
            const postData = post as IPost

            const newNotification : INotification = {
                senderId:postData?.userId,
                userId:userId as string,
                type:'post',
                message:'post liked',
                postId:postId as string
            }

            await this.notificationService.create(newNotification)

            res.status(HttpStatus.CREATED).json({message:'Successfully like created',status:true})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message,status:false})
        }
    }

    async unlike(req:Request,res:Response):Promise<unknown>{
        try {
            const {postId , userId } = req.query
            if(!postId && !userId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId and postId is missing',status:false})
                return
            }
            const response = await this.likeService.removeLike(postId as string,userId as string)
            if(!response){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'failed to delete like document.'})
                return
            }
            res.status(HttpStatus.CREATED).json({message:'Successfully deleted',status:true})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message,status:false})
        }
    }

    async fetchLIkedPostsUser(req:Request,res:Response):Promise<unknown>{
        try {
            const {postId} = req.query
            console.log('post id :',postId)
            if(!postId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'postId is missing',status:false})
                return
            }
            const response = await this.likeService.likedPostsUsers(postId as string)
            console.log('response :',response)
            if(!response){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'failed fetch liked posts'})
                return
            }
            res.status(HttpStatus.CREATED).json({message:'Successfully fetched the liked users',status:true,users:response})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message,status:false})
        }
    }
}