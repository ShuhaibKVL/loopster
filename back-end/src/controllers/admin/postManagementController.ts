import { Request, Response } from "express";
import { IPostManagementService } from "../../interfaces/admin/postManagement/IPostManagementService";
import { HttpStatus } from "../../enums/httpStatus";

export class PostManagementController {
    constructor(
        private postManagementService : IPostManagementService
    ){}

    async getAllPosts(req:Request , res:Response):Promise<any> {
        try {
            const response = await this.postManagementService.getAllPosts()
            if(!response){
                res.status(HttpStatus.NOT_FOUND).json({message:"Failed to fetch posts"})
                return
            }
            res.status(HttpStatus.OK).json({message:'Post fetch successfully',posts:response})
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"Internal server issue"})
        }
        return 
    }
}