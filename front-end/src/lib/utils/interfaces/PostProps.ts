import { IUserData } from "@/components/post_components/Post";
import { IPost } from "./IPost";

export interface IPostProps extends IPost {
    user:IUserData,
    isFollowed:boolean,
    followersCount:number,
    followedCount:number,
    isLiked?:boolean,
    likeCount?:number,
    isBookMarked?:boolean,
    _id:string
}