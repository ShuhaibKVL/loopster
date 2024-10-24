import { IFollowRepository } from "../../interfaces/follow/IFollowRepository";
import Follow, { IFollow } from "../../models/followCollectionModal";

export class FollowRespository implements IFollowRepository {

    async create(data:IFollow): Promise<any> {
        console.log('follow repository invoked..!',data)
        return await Follow.create(data)

    }

    async delete(data:IFollow): Promise<any> {
        console.log('delete follow invoked')
        return await Follow.deleteOne(data)
    }

    async isExist(data: IFollow): Promise<any> {
        return await Follow.findOne({follower:data.follower , following:data.following})
    }
}