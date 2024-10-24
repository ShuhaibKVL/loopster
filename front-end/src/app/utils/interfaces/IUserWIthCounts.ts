import { ISignUp_user } from "@/app/(auth)/signUp/page";
import { ICounts } from "./ICounts";
import { IPost } from "./IPost";

export interface IUserWithCounts extends ISignUp_user {
    follow:number,
    followers:number,
    posts:IPost[],
}