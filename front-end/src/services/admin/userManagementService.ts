import { admin_publicApi, adminApi} from "../apis/axiosInstance";
import { IUserManagementService } from "./interfaces/IUsermanagementService";

export class UserManagementService implements IUserManagementService{
    async getAllUsers(): Promise<any> {
        const response = await adminApi.get('/users')
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
}

const userManagementService = new UserManagementService()
export default userManagementService