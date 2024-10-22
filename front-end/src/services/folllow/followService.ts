import { userApi } from "../apis/axiosInstance";
import { IFollow, IFollowService } from "./interfaces/IFollowService";


export class FollowService implements IFollowService {
    async follow(data:IFollow): Promise<void> {
        console.log('follow service invoked')
        return await userApi.post('/follow-user',data)
    }

    async unFollow(data:IFollow): Promise<void> {
        console.log('unFollow service invoked')
        return await userApi.delete('/unfollow-user')
    }
}

const followService = new FollowService()
export default followService