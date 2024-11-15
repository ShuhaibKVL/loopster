import { ILike } from "../../../models/Like"

export interface ILikeService {
    createLike(data:ILike):Promise<unknown>
    removeLike(postId:string,userId:string):Promise<unknown>
    likedPostsUsers(postId:string):Promise<unknown>
}