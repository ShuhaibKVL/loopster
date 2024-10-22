import { IPost } from "../../models/Post";

export interface IPostService {
    createPost(data:IPost):Promise<any>
    deletePost(data:IPost):Promise<any>
}