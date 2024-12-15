import { ISignUp_user } from "@/app/(auth)/signUp/page";
import { IPostResponse } from "./IPost";

export interface IUserWithCounts extends ISignUp_user {
    _id?:string,
    follow:number,
    followers:number,
    followsData?:{counts:{followedCount:number,followersCount:number},followers:string[],following:string[]},
    requestPendingFollows?:string[];
    isPrivateAccount:boolean,
    posts:IPostResponse[],
}

export interface IUserWithCountsAdmin extends ISignUp_user {
    _id?:string,
    follow:number,
    followers:number,
    counts:{followedCount:number,followersCount:number},
    requestPendingFollows?:string[];
    isPrivateAccount:boolean,
    posts:IPostResponse[],
}