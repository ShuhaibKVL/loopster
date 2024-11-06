import { IPost } from "../../models/Post";
import { IReport } from "../../models/Report";

export interface IPostService {
    createPost(data:IPost,file:Buffer | undefined,fileName:string):Promise<any>
    deletePost(postId:string):Promise<any>
    reportPost(data:IReport):Promise<unknown>
    getLatestPosts(userId:string,page:number):Promise<any>
    getFollowedUsersPosts(userId:string,page:number):Promise<any>
    getBookMarkedPosts(userId:string,page:number):Promise<unknown>
}