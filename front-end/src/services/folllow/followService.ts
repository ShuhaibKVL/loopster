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
}

const followService = new FollowService()
export default followService