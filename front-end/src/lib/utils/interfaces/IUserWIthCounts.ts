import { ISignUp_user } from "@/app/(auth)/signUp/page";
import { ICounts } from "./ICounts";
import { IPost, IPostResponse } from "./IPost";

export interface IUserWithCounts extends ISignUp_user {
    follow:number,
    followers:number,
    counts?:{followedCount:number,followersCount:number},
    posts:IPostResponse[],
}