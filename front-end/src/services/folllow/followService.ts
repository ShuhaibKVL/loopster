import { ObjectId } from "mongoose";
import { userApi } from "../apis/axiosInstance";
import { IFollow, IFollowService } from "./interfaces/IFollowService";

export class FollowService implements IFollowService {
    async follow(data:IFollow): Promise<void> {
        return await userApi.post('/follow-user',data)
    }

    async unFollow(data:IFollow): Promise<void> {
        console.log('delete data :',data)
        return await userApi.delete('/unfollow-user',{data:data})
    }

    async acceptFollowRequest(followId: ObjectId,notificationId:string): Promise<void> {
        const response = await userApi.get(`/accept-follow-request?followId=${followId}&notificationId=${notificationId}`)
        return response?.data
    }

    async rejectFollowRequest(followId:string,notificationId:string):Promise<unknown>{
        const response = await userApi.delete(`/reject-follow-request?followId=${followId}&notificationId=${notificationId}`)
        return response?.data
    }

    async cancleFollowRequest(data: IFollow): Promise<unknown> {
        const response = await userApi.delete('/cancle-follow-request',{data:data})
        return response?.data
    }
}

const followService = new FollowService()
export default followService