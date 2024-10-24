import { IPost } from "../../models/Post";

export interface IPostRepository {
    create(data:IPost):Promise<any>
    delete(postId:string):Promise<any>
    findLatestPosts(userId:string):Promise<any>
}