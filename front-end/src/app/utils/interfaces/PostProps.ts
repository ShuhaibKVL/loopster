import { IUserData } from "@/app/components/post_components/Post";
import { IPost } from "./IPost";

export interface IPostProps extends IPost {
    user:IUserData,
    isFollowed:boolean,
    followersCount:number,
    followedCount:number,
    createdAt:Date,
    _id:string
}