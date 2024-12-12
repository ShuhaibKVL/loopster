import { ISignUp_user } from "@/app/(auth)/signUp/page";
import { ICounts } from "./ICounts";
import { IPost, IPostResponse } from "./IPost";

export interface IUserWithCounts extends ISignUp_user {
    follow:number,
    followers:number,
    followsData?:{counts:{followedCount:number,followersCount:number},followers:string[],following:string[]},
    requestPendingFollows?:string[];
    isPrivateAccount:boolean,
    posts:IPostResponse[],
}