import { Request , Response } from 'express'
import { IStoryService } from '../../interfaces/story/IStoryService';
import { HttpStatus } from '../../enums/httpStatus';

export class StoryController {
    constructor(
        private storyService : IStoryService
    ){}

    async createStory(req:Request,res:Response):Promise<unknown>{
        try {
            console.log('body :',req.body)
            const newStory = req.body
            console.log('new story in controller :',newStory)
            if(!newStory){
                res.status(HttpStatus.BAD_REQUEST).json({message:'new story data is missing',status:false})
                return
            }
            const createStory = await this.storyService.create(newStory)
            console.log('create story response in controller :',createStory)

            if(!createStory){
                res.status(HttpStatus.BAD_REQUEST).json({message:'The story is all ready exist',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"story created successfully",newStory:createStory,status:true})
        } catch (error:any) {
            console.log('error :',error)
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

    async fetchFollowed_Users_Stories(req:Request,res:Response):Promise<unknown>{
        try {
            const {userId} = req.params
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'userId is missing',status:false})
                return
            }
            const stories = await this.storyService.fetchFollowed_Stories(userId as string)
            console.log('stories :',stories)
            if(!stories){   
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to fetch story',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"story fetched successfully",stories:stories,status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

    async deleteStory(req:Request,res:Response):Promise<unknown>{
        try {
            const {storyId} = req.query
            console.log('storyId :',storyId)
            if(!storyId){
                res.status(HttpStatus.BAD_REQUEST).json({message:'storyId is missing',status:false})
                return
            }
            const response = await this.storyService.delete(storyId as string)
            console.log('stories :',response)
            if(!response){   
                res.status(HttpStatus.BAD_REQUEST).json({message:'Failed to delete story',status:false})
                return
            }
            res.status(HttpStatus.CREATED).json({message:"story deleted successfully",status:true})
        } catch (error:any) {
            res.status(HttpStatus.BAD_REQUEST).json({message:error.message,status:false})
        }
    }

}