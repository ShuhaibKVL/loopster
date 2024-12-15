import { ISignUp_user } from "@/app/(auth)/signUp/page";
import { IUserAuthService } from "./interfaces/IUserAuthService";
import { user_publicApi, userApi } from "../apis/axiosInstance";
import { IsignIn } from "@/app/(auth)/signIn/page";
import { ISearchUsers } from "@/lib/utils/interfaces/ISeacrchUsers";
import { IFollowedUser, IFollowers } from "@/components/user_components/FollowUnFollow";
import { IUserData } from "@/components/post_components/Post";
import { IUserDataSession } from "@/lib/utils/sessionHandler";

interface signInResponse{
    message:string,
    accessToken:string,
    userData:{
        _id:string,
        firstName:string,
        userName:string,
        profileImg:string
    },
    totalUnReadMessages:number,
    status:true,
    errors?:[]
}

class UserAuthService implements IUserAuthService{
    
    async signUp(userData: ISignUp_user): Promise<{status:boolean,message:string,user:string,errors?:[]}> {
        const response = await user_publicApi.post('/register', userData);
        return response.data;
    }

    async signIn(userData: IsignIn): Promise<signInResponse> {
        const response = await user_publicApi.post('/signIn',userData)
        return response.data
    }

    async signInWithGoogle(userData: ISignUp_user): Promise<{status:boolean,message:string,accessToken:string,userData:IUserDataSession,totalUnReadMessages:number}> {
        const response = await user_publicApi.post('/signin-with-next-auth',userData)
        return response.data
    }

    async user(user_id: string): Promise<unknown> {
        const response = await userApi.get(`/user/${user_id}`)
        return response.data
    }

    async uploadProfileImg(userId:string,formData: FormData): Promise<{status:boolean}> {
        const response = await userApi.post(`/user/${userId}/upload-profile-img`,formData)
        return response.data
    }

    async editProfile(userId: string, formData: FormData): Promise<{status:boolean}> {
        const response = await userApi.post(`/${userId}/update-profile`,formData)
        return response
    }

    async updateIsPrivateAccount(userId: string): Promise<{status:boolean,message:string}> {
        const response = await userApi.get(`/${userId}/settings/update-private-account`)
        return response?.data
    }

    async getLatestUsers(userId:string): Promise<{data:IUserData[],status:boolean}> {
        const response = await userApi.post('/latest-users',{userId})
        return response.data
    }

    async search_followed_users(userId: string, query: string): Promise<{status:boolean,message:string,users:ISearchUsers[]}> {
        const response = await userApi.get(`/${userId}/search-followed-users?query=${query}`)
        return response?.data
    }

    async getFollowedUsers(userId: string): Promise<{data:IFollowedUser[],status:boolean}> {
        const response = await userApi.get(`/followed-users?userId=${userId}`)
        return response?.data
    }

    async getFollowers(userId: string): Promise<{data:IFollowers[],status:boolean}> {
        const response = await userApi.get(`/followers?userId=${userId}`)
        return response?.data              
    }

    async getSuggestionUsers(userId:string):Promise<{status:boolean,data:IFollowers[]}>{
        const response = await userApi.get(`/suggestion-users?userId=${userId}`)
        return response?.data
    }
}

const userAuthService = new UserAuthService()
export default userAuthService