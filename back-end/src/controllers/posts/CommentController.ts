import { Request, Response } from "express";
import { HttpStatus } from "../../enums/httpStatus";
import { IPostCommentsService } from "../../interfaces/posts/comments/IPostCommentsService";
import { IComment } from "../../models/comment";
import { error } from "console";
import { ErrorMessages } from "../../enums/errorMessages";

export class CommentConroller{
    constructor(
        private commentService : IPostCommentsService
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
}