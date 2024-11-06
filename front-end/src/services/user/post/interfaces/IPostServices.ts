import { PostProps } from "@/app/components/post_components/Post"
import { IPost } from "@/lib/utils/interfaces/IPost"
import { IReport } from "@/lib/utils/interfaces/IReport"
import { IPostProps } from "@/lib/utils/interfaces/PostProps"

export interface IPostServices {
    createPost(data:IPost | FormData):Promise<any>
    deletePost(postId:string):Promise<any>
    report(data:IReport):Promise<unknown>
    getLatestPosts(userid:string,page?:number):Promise<any>
    getFollowedUserPosts(userId:string,page?:number):Promise<unknown>
    getBookMarkedPosts(userId:string,page?:number):Promise<{message:string,posts:IPostProps[]}>
}