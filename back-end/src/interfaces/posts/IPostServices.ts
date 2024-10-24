import { IPost } from "../../models/Post";

export interface IPostService {
    createPost(data:IPost,file:Buffer | undefined,fileName:string):Promise<any>
    deletePost(postId:string):Promise<any>
    getLatestPosts(userId:string):Promise<any>
}