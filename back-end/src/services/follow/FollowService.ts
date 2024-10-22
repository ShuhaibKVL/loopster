import { IFollowRepository } from "../../interfaces/follow/IFollowRepository";
import { IFollowService } from "../../interfaces/follow/IFollowService";
import { IFollow } from "../../models/followCollectionModal";

export class FollowService implements IFollowService {
    constructor(private followRepository : IFollowRepository){}

    async follow(data:IFollow): Promise<any> {
        const isExist = await this.followRepository.isExist(data)
        console.log('is Exist follow :',isExist)
        if(isExist){
            return false
        }
        return await this.followRepository.create(data)
        
    }

    async unFollow(data:IFollow): Promise<any> {
        return await this.followRepository.delete(data)
    }

}