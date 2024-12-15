import { IsignIn } from "@/app/(auth)/signIn/page";
import { ISignUp_user } from "@/app/(auth)/signUp/page";

export interface IUserAuthService {
    signUp(userData:ISignUp_user):Promise<any>
    signIn(userData:IsignIn):Promise<any>
    user(user_id:any):Promise<any>
    uploadProfileImg(userId:string,formData:FormData):Promise<any>
    editProfile(userId:string,formData:FormData):Promise<any>
    getLatestUsers(userId:string):Promise<any>
    search_followed_users(userId:string,query:string):Promise<unknown>
    getFollowedUsers(userId:string):Promise<unknown>
    getFollowers(userId:string):Promise<unknown>
    getSuggestionUsers(userId:string):Promise<unknown>
}