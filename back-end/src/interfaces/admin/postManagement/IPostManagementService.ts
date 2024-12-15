import { ClientSession } from "mongoose"

export interface IPostManagementService {
    getAllPosts(page:number):Promise<any>
    listUnList(postId:string):Promise<unknown>
    updateIsReport(postId:string,reportId:string,session?:ClientSession):Promise<unknown>
    findMostLikedPost():Promise<unknown>
    findPostsBasedOnDay():Promise<unknown>
}