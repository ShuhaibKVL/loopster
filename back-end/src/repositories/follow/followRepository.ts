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

    async findFollowedUsers(userId: string): Promise<unknown> {
        return await Follow.find({follower:userId})
        .populate('following', 'userName _id profileImage fullName')
    }

    async findFollowers(userId: string): Promise<unknown> {
        return await Follow.find({following:userId})
        .populate('follower', 'userName _id profileImage fullName')
    }

    async findUnFollowedUsers(userId: string): Promise<unknown> {
        return await Follow.find({following :{$ne:userId}})
        .populate('follower', 'userName _id profileImage fullName')
    }

    async findMostFollowersUsers(): Promise<unknown> {
        return await Follow.aggregate([
            {$group:{_id:{$toObjectId:'$following'},followersCount:{$sum:1}}},
            {$lookup:{
                from:'users',
                localField:'_id',
                foreignField:'_id',
                as:'userDetails'
            }},
            {$sort:{followersCount:-1}},
            {$project:{
                _id:0,
                followersCount:1,
                postDetails:1,
                'userDetails._id':1,
                'userDetails.fullName':1,
                'userDetails.userName':1,
                'userDetails.profileImage':1,
            }},
            {$limit:10}
        ])
    }
}