import mongoose from "mongoose";
import { IUserManagementRepository } from "../../interfaces/admin/userManagment/IUserManagementRepository";
import User from "../../models/userModel";

export class UserManagementRepo implements IUserManagementRepository {

    async findAllUsers(page:number): Promise<any> {
        try {
            const totalUsers = await User.countDocuments()
            const limit = 10
            const totalPages = Math.ceil( totalUsers / limit)

            const users = await User.find({}).sort({createdAt:-1}).skip((limit * page) - limit).limit(limit)

            const result ={
                users:users,
                totalPages:totalPages
            }
            return result
        } catch (error) {
            console.log(error)
        }
    }

    async updateIsBlock(userId: string): Promise<any> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        console.log('block repo invoked');
        try {
            const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { isBlocked: !user.isBlocked } },
            { new: true }
            );
        console.log('updatedUser :', updatedUser);
        return true;
        } catch (error) {
            console.error('Error in Repository:', error);
            throw error; // Rethrow to be caught by service
        }
    }


    async updateIsList(userId: string): Promise<any> {
        console.log('update list repository invoked.')
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { isList: !user.isList } },
            { new: true }
        );

        console.log("updateUser :",updatedUser)
        return updatedUser;
    }

    async getTotalAccountsCount(): Promise<unknown> {
        return await User.countDocuments()
    }

    async findUsersBasedOnDays(): Promise<unknown> {
        return await User.aggregate([
            {$group:
                {_id:{
                    $dateToString:{format:"%Y-%m-%d",date:"$createdAt"}
                },
                users:{$sum:1}
            }  
            },
            {$sort:{_id:1}}
        ])
    }

    async findById(_id: string): Promise<unknown> {
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
        }catch (error){
            console.log(error)
            return false
        }
    }

}