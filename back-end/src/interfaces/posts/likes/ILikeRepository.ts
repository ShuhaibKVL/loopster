import { ILike } from "../../../models/Like"

export interface ILikeRepository{
    like(data:ILike):Promise<unknown>
    unLike(postId:string,userId:string):Promise<unknown>
    likedPostsUsers(postId:string):Promise<unknown>
}