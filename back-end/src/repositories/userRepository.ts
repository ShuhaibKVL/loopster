import { ObjectId } from 'mongoose';
import { IUserRepository } from '../interfaces/IUserRepository';
import User,{IUser} from '../models/userModel'
import mongoose, { Types } from 'mongoose';
import Follow from '../models/followCollectionModal';

// Accessing the ObjectId constructor from Types
const ObjectId = Types.ObjectId;
export class UserRepository implements IUserRepository {
    async create(userData: IUser): Promise<IUser> {
        return await User.create(userData)
    }

    async findByEmail(email: string): Promise<any> {
        return await User.findOne({email:email})
    }

    async findByUserName(userName: string): Promise<any> {
        return await User.findOne({userName:userName})
    }

    async verifyUser(_id: ObjectId): Promise<any> {
        return await User.findByIdAndUpdate(_id,{isVerified:true})
    }

    async findById(_id: string): Promise<any> {
        try {
            return await User.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(_id) } },
                {
                    $lookup: {
                        from: 'follows',
                        let: { userId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            { $eq: ['$follower', '$$userId'] },
                                            { $eq: ['$following', '$$userId'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    followedCount: {
                                        $sum: { $cond: [{ $eq: ['$follower', '$$userId'] }, 1, 0] }
                                    },
                                    followersCount: {
                                        $sum: { $cond: [{ $eq: ['$following', '$$userId'] }, 1, 0] }
                                    }
                                }
                            }
                        ],
                        as: 'counts'
                    }
                },
                {
                    $unwind: {
                        path: '$counts',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'posts',
                        let: { userId: '$_id' },
                        pipeline: [
                            {
                                $sort:{createdAt:-1}
                            },
                            { $match: { isList:true } },
                            {
                                $match: {
                                    $expr: {
                                    $eq: [{ $toObjectId: '$userId' }, '$$userId']
                                    }
                                }
                            }
                        ],
                        as: 'posts'
                    }
                    },
                {
                    $project : {password : 0}
                }
            ]);
        } catch (error) {
            console.log("error on finById respository :",error)
            return error
        }
    }

    async updateProfileImage(userId: string, imageUrl: string): Promise<any> {
        const response =  await User.findByIdAndUpdate(userId , {profileImage:imageUrl},{new:true})
        console.log('resopnse inside repository :',response)
        if (response) {
            console.log("Update successful");
            } else {
            console.log("No document found with the provided ID");
        }
        return response
    }

    async findByIdAndUpdate(userId: string, formData: FormData): Promise<any> {
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { $set: formData },
            { new: true, runValidators: true }
        );
        return updatedUser
    }

    async findLatestUsers(userId:string): Promise<any> {
        console.log('repository findLatestUsers :')
        try {
            console.log('User ID:', userId);
            if (!Types.ObjectId.isValid(userId)) {
                throw new Error('Invalid user ID');
            }

    const users = await User.aggregate([
        {
            $lookup: {
                from: 'follows',
                let: { currentUserId: new mongoose.Types.ObjectId(userId), fetchedUserId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$follower', '$$currentUserId'] },
                                    { $eq: ['$following', '$$fetchedUserId'] }
                                ]
                            }
                        }
                    },
                    { $project: { _id: 1 } }
                ],
                as: 'followInfo'
            }
        },
        {
            $addFields: {
                isFollowed: { $gt: [{ $size: '$followInfo' }, 0] }
            }
        },
        {
            $lookup: {
                from: 'follows',
                let: { fetchedUserId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$following', '$$fetchedUserId']
                            }
                        }
                    },
                    {
                        $count: 'followersCount'
                    }
                ],
                as: 'followers'
            }
        },
        {
            $lookup: {
                from: 'follows',
                let: { fetchedUserId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$follower', '$$fetchedUserId']
                            }
                        }
                    },
                    {
                        $count: 'followedCount'
                    }
                ],
                as: 'followed'
            }
        },
        {
            $addFields: {
                followersCount: { $ifNull: [{ $arrayElemAt: ['$followers.followersCount', 0] }, 0] },
                followedCount: { $ifNull: [{ $arrayElemAt: ['$followed.followedCount', 0] }, 0] }
            }
        },
        {
            $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            
            $project: {
                followInfo: 0,
                password: 0,
                isBlocked: 0,
                isVerified: 0,
                email: 0,
                isList: 0,
                createdAt: 0,
                updatedAt: 0
            }
        }
    ]);
    
            return users
        } catch (error) {
            console.log(error)
        }
        
    }
}
