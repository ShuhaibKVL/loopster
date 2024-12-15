import { IMostFollowedAccount } from "@/components/DashBoard/MostFollowedAccounts";
import { adminApi} from "../apis/axiosInstance";
import { IUserManagementService } from "./interfaces/IUsermanagementService";
import { IUserWithCountsAdmin } from "@/lib/utils/interfaces/IUserWIthCounts";

export class UserManagementService implements IUserManagementService{
    async getAllUsers(page:number): Promise<unknown> {
        const response = await adminApi.get(`/users?page=${page}`)
        return response.data
    }

    async handleBlockUnBlock(userId: string): Promise<void> {
        console.log('handle block fn invoked')
        const response = await adminApi.patch(`/user/${userId}/block`)
        console.log("response :",response)
    }

    async handleListUnList(userId: string): Promise<void> {
        const response = await adminApi.patch(`/user/${userId}/unlist`)
        console.log('response :',response)
    }

    async findMostFollowedAccounts(): Promise<{status:boolean,data:IMostFollowedAccount[]}> {
        const response = await adminApi.get('/user/most-followed-accounts')
        return response?.data
    }

    async getTotalAccounts(): Promise<{message:string,status:boolean,totalUsers:number}> {
        const response = await adminApi.get('/user/get-total-accounts')
        return response?.data
    }

    async getUserData(userId: string): Promise<{ message: string; status: boolean; user:IUserWithCountsAdmin[]; }> {
        const respnse = await adminApi.get(`/user?userId=${userId}`)
        return respnse?.data
    }
    
}

const userManagementService = new UserManagementService()
export default userManagementService