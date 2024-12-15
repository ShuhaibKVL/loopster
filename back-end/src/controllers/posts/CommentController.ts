import { Request, Response } from "express";
import { HttpStatus } from "../../enums/httpStatus";
import { IPostCommentsService } from "../../interfaces/posts/comments/IPostCommentsService";
import { IComment } from "../../models/comment";
import { error } from "console";
import { ErrorMessages } from "../../enums/errorMessages";
import { IPostService } from "../../interfaces/posts/IPostServices";
import { INotificationService } from "../../interfaces/notification/INotificationService";
import { INotification } from "../../models/notification";
import { IPost } from "../../models/Post";

export class CommentConroller{
    constructor(
        private commentService : IPostCommentsService,
        private postService : IPostService,
        private notificationService : INotificationService
    ){}

    async createComment(req:Request , res:Response):Promise<unknown>{
        try {
            const newComment : IComment = req.body
            console.log('comment :',newComment)
            if(!newComment?.comment && !newComment?.userId && !newComment?.postId){
                res.status(HttpStatus.BAD_REQUEST).json({message:ErrorMessages.INVALID_CREDENTIAL})
                return
            }
            const response = await this.commentService.createComment(newComment)
            console.log('create comment response :',response)
            if(!response){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'Failed to create new comment',status:false})
                return
            }

            const post  = await this.postService.findPostById(newComment?.postId.toString())
            if(!post){
                console.log('Failed to fetch post')
            }
            const postData = post as IPost

            const newNotification : INotification = {
                senderId:postData?.userId,
                userId:newComment?.userId.toString(),
                type:'comment',
                message:'commented on your post',
                postId:newComment?.postId.toString()
            }

            console.log('new notification created :',newNotification)

            await this.notificationService.create(newNotification)

            res.status(HttpStatus.CREATED).json({message:"comment created successfully",status:true})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async getPostComments(req:Request , res:Response):Promise<unknown>{
        try {
            console.log('get comments controller invoked')
            const postId = req.query.postId
            console.log('postId :',postId)
            if(!postId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'postId not found'})
                return
            }
            const comments = await this.commentService.getComments(postId as string)
            console.log('comments :',comments)
            if(!comments){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'Failed to fetch comments',status:false})
                return
            }
            res.status(HttpStatus.OK).json({message:"comment created successfully",comments:comments,status:true})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async deleteComment(req:Request,res:Response):Promise<unknown>{
        try {
            const comment_id = req.query?.comment_id
            if(!comment_id){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'comment id is missing'})
                return
            }
            const deleteComment = await this.commentService.deleteComment(comment_id as string)
            if(!deleteComment){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'Failed to delete the comment',status:false})
                return
            }
            res.status(HttpStatus.OK).json({message:'Comment deleted successfully',status:true})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message,status:false})
        }
    }

    async likeComment(req:Request,res:Response):Promise<unknown>{
        try {
            const { userId , commentId ,postId} = req.body
            if(!userId || !commentId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'comment id is missing'})
                return
            }
            const likeComment = await this.commentService.Like(commentId as string,userId as string)
            if(!likeComment){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'Failed to like Comment',status:false})
                return
            }

            const post  = await this.postService.findPostById(postId)
            if(!post){
                console.log('Failed to fetch post')
            }
            const postData = post as IPost

            const newNotification : INotification = {
                senderId:postData?.userId,
                userId:userId,
                type:'comment',
                message:'liked your comment',
                postId:postId
            }

            console.log('new notification created :',newNotification)

            await this.notificationService.create(newNotification)

            res.status(HttpStatus.OK).json({message:'Comment liked successfully',status:true})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message,status:false})
        }
    }

    async unLikeComment(req:Request,res:Response):Promise<unknown>{
        try {
            const { userId , commentId } = req.body
            if(!userId || !commentId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'comment id is missing'})
                return
            }
            const unlikeComment = await this.commentService.unlike(commentId as string,userId as string)
            if(!unlikeComment){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'Failed to Unlike Comment',status:false})
                return
            }
            res.status(HttpStatus.OK).json({message:'Comment unliked successfully',status:true})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message,status:false})
        }
    }
}