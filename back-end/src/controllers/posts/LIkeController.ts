import { Request, Response } from "express";
import { ILikeService } from "../../interfaces/posts/likes/ILikeService";
import { HttpStatus } from "../../enums/httpStatus";
import { ILike } from "../../models/Like";

export class LikeController {
    constructor(
        private likeService : ILikeService
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
}