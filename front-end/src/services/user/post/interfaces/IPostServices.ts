import { IPost } from "@/lib/utils/interfaces/IPost"
import { IReport } from "@/lib/utils/interfaces/IReport"
import { IPostProps } from "@/lib/utils/interfaces/PostProps"

export interface IPostServices {
    createPost(data:IPost | FormData):Promise<unknown>
    deletePost(postId:string):Promise<unknown>
    update(content:string,postId:string):Promise<unknown>
    report(data:IReport):Promise<unknown>
    getLatestPosts(userid:string,page?:number):Promise<unknown>
    getFollowedUserPosts(userId:string,page?:number):Promise<unknown>
    getBookMarkedPosts(userId:string,page?:number):Promise<{message:string,posts:IPostProps[]}>
    getPost(postId:string,userId:string):Promise<unknown>
}