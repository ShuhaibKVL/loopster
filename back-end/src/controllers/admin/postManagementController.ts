import { Request, Response } from "express";
import { IPostManagementService } from "../../interfaces/admin/postManagement/IPostManagementService";
import { HttpStatus } from "../../enums/httpStatus";
import TransactionSessionManager from "../../utils/TransactionSessionHelper";

export class PostManagementController {
    constructor(
        private postManagementService : IPostManagementService
    ){}

    async getAllPosts(req:Request , res:Response):Promise<any> {
        try {
            const page = req.query.page
            console.log('page :',page)
            const response = await this.postManagementService.getAllPosts(Number(page))
            console.log('res :',response.length)
            if(!response){
                res.status(HttpStatus.NOT_FOUND).json({message:"Failed to fetch posts"})
                return
            }
            res.status(HttpStatus.OK).json({message:'Post fetch successfully',posts:response})
            return
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server issue"})
        }
    }

    async listUnList(req:Request , res:Response):Promise<unknown> {
        try {
            const postId = req.query.postId
            console.log('list  unlist ,postId :',postId)
            if(!postId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to handle list posts.'})
                return
            }
            const response = await this.postManagementService.listUnList(postId as string)
            console.log('response :',response)
            if(!response){
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Failed to update the post.'})
                return
            }
            res.status(HttpStatus.OK).json({message:'Post updated successfully.'})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message})
        }
    }

    async reportPost(req:Request , res:Response):Promise<unknown> {
        console.log('report post controller ...')
        // handlign mongodb taransation to consistency update
        // const session = await TransactionSessionManager.startSession()
        
        try {
            const postId = req.query.postId
            const reportId = req.query.reportId
            console.log('report post ,postId,reportId :',postId,reportId)
            if(!postId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Post id missing..!'})
                return
            }
            // start the taransaction
            // session.startTransaction()
            const response = await this.postManagementService.updateIsReport(postId as string ,reportId as string)
            console.log('response :',response)
            if(!response){
                //if response ok, backward the mongodb transaction for data consistency
                // await session.abortTransaction();
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:'Failed to update the post.'})
                return
            }
            // await session.commitTransaction();
            res.status(HttpStatus.OK).json({message:'Post updated successfully.'})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message}) 
        }
    }
}