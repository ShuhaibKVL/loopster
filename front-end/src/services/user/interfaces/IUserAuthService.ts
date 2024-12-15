import { IsignIn } from "@/app/(auth)/signIn/page";
import { ISignUp_user } from "@/app/(auth)/signUp/page";

export interface IUserAuthService {
    signUp(userData:ISignUp_user):Promise<unknown>
    signIn(userData:IsignIn):Promise<unknown>
    signInWithGoogle(userData:ISignUp_user):Promise<unknown>
    user(user_id:string):Promise<unknown>
    uploadProfileImg(userId:string,formData:FormData):Promise<unknown>
    editProfile(userId:string,formData:FormData):Promise<unknown>
    updateIsPrivateAccount(userId:string):Promise<unknown>
    getLatestUsers(userId:string):Promise<unknown>
    search_followed_users(userId:string,query:string):Promise<unknown>
    getFollowedUsers(userId:string):Promise<unknown>
    getFollowers(userId:string):Promise<unknown>
    getSuggestionUsers(userId:string):Promise<unknown>
}