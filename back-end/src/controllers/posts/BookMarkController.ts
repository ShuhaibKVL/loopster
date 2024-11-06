import { Request,Response } from "express";
import { IBookMarkService } from "../../interfaces/posts/bookmark/IBookMarkService";
import { HttpStatus } from "../../enums/httpStatus";

export class BookMarkController{
    constructor(
        private bookMarkService : IBookMarkService
    ){}

    async create(req:Request,res:Response):Promise<unknown>{
        try {
            const { postId , userId } = req.query
            if(!userId && !postId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId and postId is missing',status:false})
                return
            }
            const response = await this.bookMarkService.create(userId as string,postId as string)
            console.log('response : crearted',response)
            if(!response){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'failed to create bookMark document.'})
                return
            }
            res.status(HttpStatus.CREATED).json({message:'Successfully bookMark created',status:true})
            return

        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message,status:false})
        }
    }

    async delete(req:Request,res:Response):Promise<unknown>{
        try {
            const {postId , userId } = req.query
            if(!postId && !userId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId and postId is missing',status:false})
                return
            }
            const response = await this.bookMarkService.delete(userId as string,postId as string)
            console.log('response :',response)
            if(!response){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'failed to delete bookMark document.'})
                return
            }
            res.status(HttpStatus.CREATED).json({message:'Successfully deleted',status:true})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message,status:false})
        }
    }
}