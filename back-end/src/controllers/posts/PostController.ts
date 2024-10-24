import { HttpStatus } from "../../enums/httpStatus";
import { Request, Response } from "express";
import { IPostService } from "../../interfaces/posts/IPostServices";
import { PostRepository } from "../../repositories/posts/postRepository";
import { ErrorMessages } from "../../enums/errorMessages";

export class PostController{
    constructor(
        private postServices : IPostService
    ){}

    async createPost(req:Request,res:Response):Promise<any>{
        try {
            console.log('create post controller invoked...',)
            const newPostData = req.body
            console.log("newPostData : >",newPostData)
            const file = req.file
            console.log('file in post controller :',file)
            const fileName = `profile-images/${file?.originalname}-${Date.now()}.jpeg`;

            const createPost = await this.postServices.createPost(newPostData,file?.buffer,fileName)
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
            const postId = req.query.postId
            console.log('post id',postId)
            const response = await this.postServices.deletePost(postId as string)
            console.log("response :",response)
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Filed to delete post.Try again',status:false})
            }
            res.status(HttpStatus.OK).json({message:'Post deleted success fully.'})
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message})
        }
    }

    async getLatestPosts(req:Request, res:Response):Promise<any>{
        try {
            const userId = req.params.userId
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'User id missing',status:false})
                return
            }

            const posts = await this.postServices.getLatestPosts(userId)
            console.log('post inside the post controller :',posts)
            if(posts){
                res.status(HttpStatus.OK).json({message:'Post data find successfully',posts:posts})
                return
            }
            res.status(HttpStatus.NOT_FOUND).json({message:'Failed to find posts.'})
            return
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }
}