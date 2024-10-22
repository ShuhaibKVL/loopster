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
        console.log('repository findByEmail',email)
        return await User.findOne({email:email})
    }

    async findByUserName(userName: string): Promise<any> {
        return await User.findOne({userName:userName})
    }

    async verifyUser(_id: ObjectId): Promise<any> {
        return await User.findByIdAndUpdate(_id,{isVerified:true})
    }

    async findById(_id: string): Promise<any> {
        console.log('findById invoked')
        try {
            return await User.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(_id) } },
                {
                    $lookup: {
                        from: 'follows', // Adjust to your actual collection name
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
                        preserveNullAndEmptyArrays: true // Allow for cases where counts might be empty
                    }
                },
                {
                    $project : {password : 0}
                }
            ]);
        } catch (error) {
            console.log("error on finById respository :",error)
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
            { $set: formData }, // Update only the fields that are present in updatedProfileData
            { new: true, runValidators: true }  // `new: true` returns the updated document, `runValidators` ensures the schema validation runs
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
                from: 'follows', // The name of your follow collection
                let: { currentUserId: new mongoose.Types.ObjectId(userId), fetchedUserId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$follower', '$$currentUserId'] }, // Matches the follower ID
                                    { $eq: ['$following', '$$fetchedUserId'] } // Matches the following ID
                                ]
                            }
                        }
                    },
                    { $project: { _id: 1 } } // Only return the _id to check existence
                ],
                as: 'followInfo' // This will hold the result of the lookup
            }
        },
        {
            $addFields: {
                isFollowed: { $gt: [{ $size: '$followInfo' }, 0] } // Set isFollowed to true if there are any matches
            }
        },
        {
            $lookup: {
                from: 'follows', // The same follows collection
                let: { fetchedUserId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$following', '$$fetchedUserId'] // Count the number of followers for this user
                            }
                        }
                    },
                    {
                        $count: 'followersCount' // Count the followers
                    }
                ],
                as: 'followers' // Store the result in 'followers'
            }
        },
        {
            $lookup: {
                from: 'follows', // The same follows collection
                let: { fetchedUserId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$follower', '$$fetchedUserId'] // Count the number of followed users
                            }
                        }
                    },
                    {
                        $count: 'followedCount' // Count the followed users
                    }
                ],
                as: 'followed' // Store the result in 'followed'
            }
        },
        {
            $addFields: {
                followersCount: { $ifNull: [{ $arrayElemAt: ['$followers.followersCount', 0] }, 0] }, // Get followers count
                followedCount: { $ifNull: [{ $arrayElemAt: ['$followed.followedCount', 0] }, 0] } // Get followed count
            }
        },
        {
            $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } }
        },
        {
            $sort: {
                createdAt: -1 // Sort by createdAt in descending order
            }
        },
        {
            // Exclude sensitive fields from the result
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
