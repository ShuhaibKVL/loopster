import { ClientSession } from "mongoose"

export interface IPostManagementRepository {
    fetchAllPosts(page?:number):Promise<unknown>
    updateList(postId:string):Promise<unknown>
    updateIsReport(postId:string,session?:ClientSession):Promise<unknown>
    findMostLikedPost():Promise<unknown>
    findPostsBasedOnDay():Promise<unknown>
}