import { Request, Response } from "express";
import { IUnsplashService } from "../../interfaces/unsplash/IUnsplashService";
import { HttpStatus } from "../../enums/httpStatus";
import { ErrorMessages } from "../../enums/errorMessages";

export class UnsplashController {
    constructor(
        private unsplashService : IUnsplashService
    ){}

    async searchImages(req:Request , res:Response):Promise<void>{
        console.log('unsplash controller invoked')
        try {
            const page = Number(req.query.page) || 1
            const query = req.query.query as string || ''
            const per_page = Number(req.query.per_page) || 10

            console.log('query inside the controller :',page,query,per_page)

            const result = await this.unsplashService.searchPhotos(query,page,per_page)
            console.log('unsplash result :',result)
            if(!result){
                res.status(HttpStatus.NOT_FOUND).json({message:'Failed to load data from unsplash'})
                return
            }
            res.status(HttpStatus.OK).json({result})
        } catch (error:any) {
            console.log('error on unsplash controller :',error)
            res.status(HttpStatus.BAD_REQUEST).json(error.message)
        }
    }

}