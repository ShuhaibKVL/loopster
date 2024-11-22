import { ISignUp_user } from "@/app/(auth)/signUp/page";
import { IUserAuthService } from "./interfaces/IUserAuthService";
import { user_publicApi, userApi } from "../apis/axiosInstance";
import { IsignIn } from "@/app/(auth)/signIn/page";
import { ISearchUsers } from "@/lib/utils/interfaces/ISeacrchUsers";

class UserAuthService implements IUserAuthService{
    
    async signUp(userData: ISignUp_user): Promise<any> {
        const response = await user_publicApi.post('/register', userData);
        return response.data;
    }

    async signIn(userData: IsignIn): Promise<any> {
        const response = await user_publicApi.post('/signIn',userData)
        return response.data
    }

    async user(user_id: string): Promise<any> {
        const response = await userApi.get(`/user/${user_id}`)
        return response.data
    }

    async uploadProfileImg(userId:string,formData: FormData): Promise<any> {
        const response = await userApi.post(`/user/${userId}/upload-profile-img`,formData)
        return response.data
    }

    async editProfile(userId: string, formData: FormData): Promise<any> {
        const response = await userApi.post(`/${userId}/update-profile`,formData)
        return response
    }

    async getLatestUsers(userId:string): Promise<any> {
        const response = await userApi.post('/latest-users',{userId})
        return response.data
        
    }

    async search_followed_users(userId: string, query: string): Promise<{status:boolean,message:string,users:ISearchUsers[]}> {
        const response = await userApi.get(`/${userId}/search-followed-users?query=${query}`)
        return response?.data
    }
}

const userAuthService = new UserAuthService()
export default userAuthService