import { Response,Request, NextFunction } from "express"
import { HttpStatus } from "../../enums/httpStatus"
import { IPostManagementService } from "../../interfaces/admin/postManagement/IPostManagementService"
import { IUserManagementService } from "../../interfaces/admin/userManagment/IUserManagmentService"

export class DashBoardController{
    constructor(
        private postManagementService : IPostManagementService,
        private userManagementService : IUserManagementService
    ){}

    async getChartData(req:Request,res:Response):Promise<unknown>{
        try {
            const users = await this.userManagementService.findUsersBasedOnDays()
            console.log('users on dashboard controller :',users)
            if(!users){
                res.status(HttpStatus.NOT_FOUND).json({message:"Failed to fetch posts",status:false})
                return
            }
            
            const posts = await this.postManagementService.findPostsBasedOnDay()
            console.log('posts on dashboard controller :',posts)
            if(!posts){
                res.status(HttpStatus.NOT_FOUND).json({message:"Failed to fetch posts",status:false})
                return
            }
            
            const data = {
                users:users,
                posts:posts
            }
            
            res.status(HttpStatus.OK).json({message:'Post fetch successfully',data:data,status:true})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }
}