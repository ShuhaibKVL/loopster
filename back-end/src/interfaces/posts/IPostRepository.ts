import { IPost } from "../../models/Post";
import { IReport } from "../../models/Report";

export interface IPostRepository {
    create(data:IPost):Promise<any>
    delete(postId:string):Promise<any>
    report(data:IReport):Promise<unknown>
    findLatestPosts(userId:string,page:number):Promise<any>
    findFollowedUserPost(userId:string,page:number):Promise<unknown>
    findBookMarkedPosts(userId:string,page:number):Promise<unknown>
}