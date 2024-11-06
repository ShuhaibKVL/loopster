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
                return
            }
            res.status(HttpStatus.CREATED).json({message:"Post created successfully",newPost:createPost,status:true})
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async DeletePost(req:Request,res:Response):Promise<any>{
        try {
            const postId = req.query.postId
            const response = await this.postServices.deletePost(postId as string)
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'Filed to delete post.Try again',status:false})
            }
            res.status(HttpStatus.OK).json({message:'Post deleted success fully.'})
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message})
        }
    }

    async reportPost(req:Request, res:Response):Promise<unknown>{
        try {
            const data = req.body
            if(!data){
                res.status(HttpStatus.BAD_REQUEST).json({message:"Credential missing..!"})
                return 
            }
            const response = await this.postServices.reportPost(data)
            if(!response){
                res.status(HttpStatus.BAD_REQUEST).json({message:'failed to report'})
                return
            }
            res.status(HttpStatus.OK).json({message:"Post report created successfully."})
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:error.message})
        }
    }

    async getLatestPosts(req:Request, res:Response):Promise<any>{
        try {
            const userId = req.params.userId
            const page = req.query.page || 1
            console.log('inside the controler :',userId,page)
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'User id missing',status:false})
                return
            }

            const posts = await this.postServices.getLatestPosts(userId,Number(page))
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

    async getFollowedUsersPosts(req:Request,res:Response):Promise<unknown>{
        try {
            const userId = req.params.userId
            const page = req.query.page || 1
            console.log('inside the controler :',userId,page)
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'User id missing',status:false})
                return
            }
            const posts = await this.postServices.getFollowedUsersPosts(userId,Number(page))
            if(!posts){
                res.status(HttpStatus.NOT_FOUND).json({message:'Failed to find posts.'})
                return
            }
            res.status(HttpStatus.OK).json({message:'Post data find successfully',posts:posts})
            return
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async getBookMarkedPosts(req:Request,res:Response):Promise<unknown>{
        try {
            const userId = req.params.userId
            const page = req.query.page || 1
            console.log('inside the get book marked controler :',userId,page)
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'User id missing',status:false})
                return
            }
            const posts = await this.postServices.getBookMarkedPosts(userId,Number(page))
            if(!posts){
                res.status(HttpStatus.NOT_FOUND).json({message:'Failed to find posts.'})
                return
            }
            res.status(HttpStatus.OK).json({message:'Post data find successfully',posts:posts})
            return
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    
}