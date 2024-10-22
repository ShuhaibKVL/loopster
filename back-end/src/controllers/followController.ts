import { Request,Response } from "express";
import { IFollowService } from "../interfaces/follow/IFollowService";
import { HttpStatus } from "../enums/httpStatus";

export default class FollowController {
    constructor(private followService:IFollowService){}

    async follow(req:Request,res:Response){
        try {
            const newFollowDoc = req.body
            const response = await this.followService.follow(newFollowDoc)
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'failed to follow,Try again.'})
            }
            res.status(HttpStatus.CREATED).json({message:'followed successfully'})
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async unFollow(req:Request , res:Response) {
        try {
            const deleteDoc = req.body
            const response = await this.followService.unFollow(deleteDoc)
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'failed to unFollow,Try again.'})
            }
            res.status(HttpStatus.CREATED).json({message:'UnFollowed successfully'})
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }
}