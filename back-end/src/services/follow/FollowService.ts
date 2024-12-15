import { ObjectId } from "mongoose";
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

    async deleteById(followId: string): Promise<unknown> {
        return await this.followRepository.deleteById(followId)
    }

    async findByDoc(data: IFollow): Promise<unknown> {
        return await this.followRepository.findByDoc(data)
    }
    
    async findFollowedUsers(userId: string): Promise<unknown> {
        return await this.followRepository.findFollowedUsers(userId)
    }

    async findFollowers(userId: string): Promise<unknown> {
        return await this.followRepository.findFollowers(userId)
    }

    async findUnFollowedUsers(userId: string): Promise<unknown> {
        return await this.followRepository.findUnFollowedUsers(userId)
    }

    async findMostFollowersUsers(): Promise<unknown> {
        return await this.followRepository.findMostFollowersUsers()
    }

    async AcceptFollowRequest(followId: string): Promise<unknown> {
        return await this.followRepository.AcceptFollowRequest(followId)
    }

}