import { HttpStatus } from "../../enums/httpStatus";
import { Request, Response } from "express";
import { IPostService } from "../../interfaces/posts/IPostServices";

export class PostController{
    constructor(
        private postServices : IPostService
    ){}

    async createPost(req:Request,res:Response):Promise<any>{
        try {
            console.log('create post controller invoked...',)
            const newPostData = req.body
            console.log("newPostData : >",newPostData)
            const createPost = await this.postServices.createPost(newPostData)
            console.log('createPost :',createPost)
            if(!createPost){
                res.status(HttpStatus.FORBIDDEN).json({message:'Failed to create new post',status:false})
            }
            res.status(HttpStatus.CREATED).json({message:"Post created successfully",newPost:createPost,status:true})
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async DeletePost(req:Request,res:Response):Promise<any>{
        try {
            
        } catch (error) {
            
        }
    }
}