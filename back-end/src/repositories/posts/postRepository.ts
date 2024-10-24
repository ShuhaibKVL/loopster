
import mongoose from "mongoose";
import { IPostRepository } from "../../interfaces/posts/IPostRepository";
import Post, { IPost } from "../../models/Post";

export class PostRepository implements IPostRepository {
    async create(data: IPost): Promise<any> {
        return  await Post.create(data)
    }

    async delete(postId: string): Promise<any> {
        return await Post.findByIdAndUpdate(postId,{isList:false})
    }

    async findLatestPosts(userId: string): Promise<any> {
        try {
            const posts = await Post.aggregate([
                {
                    // Sort the posts by the latest first
                    $sort: { createdAt: -1 }
                },
                {$match:{$nor:[{isList:false},{isReported:true}]}},
                {
                    // Convert the `userId` field (string) to `ObjectId` for lookup
                    $addFields: {
                        userObjectId: { $toObjectId: "$userId" }
                    }
                },
                {
                    // Lookup user data from the 'users' collection
                    $lookup: {
                        from: 'users',  // Collection name for users
                        localField: 'userObjectId',  // Field to match from Post
                        foreignField: '_id',  // Field to match in User
                        as: 'user'
                    }
                },
                {
                    // Unwind the user array to get a single user object
                    $unwind: '$user'
                },
                {
                    // Perform the first lookup to get follow information (if the current user is following this user)
                    $lookup: {
                        from: 'follows',  // Collection name for follows
                        let: { currentUserId: new mongoose.Types.ObjectId(userId), fetchedUserId: '$user._id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$follower', '$$currentUserId'] },  // Match the current user's follow record
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
                    // Add an `isFollowed` field to indicate if the current user follows this post's user
                    $addFields: {
                        isFollowed: { $gt: [{ $size: '$followInfo' }, 0] }
                    }
                },
                {
                    // Lookup followers count for the post's user
                    $lookup: {
                        from: 'follows',
                        let: { fetchedUserId: '$user._id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$following', '$$fetchedUserId']  // Get followers of the post's user
                                    }
                                }
                            },
                            {
                                $count: 'followersCount'  // Count the number of followers
                            }
                        ],
                        as: 'followers'
                    }
                },
                {
                    // Lookup following count for the post's user (how many users the post's user is following)
                    $lookup: {
                        from: 'follows',
                        let: { fetchedUserId: '$user._id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ['$follower', '$$fetchedUserId']  // Get users followed by the post's user
                                    }
                                }
                            },
                            {
                                $count: 'followedCount'  // Count the number of followed users
                            }
                        ],
                        as: 'followed'
                    }
                },
                {
                    // Add fields for followers count and followed count
                    $addFields: {
                        followersCount: { $ifNull: [{ $arrayElemAt: ['$followers.followersCount', 0] }, 0] },
                        followedCount: { $ifNull: [{ $arrayElemAt: ['$followed.followedCount', 0] }, 0] }
                    }
                },
                {
                    // Project only the necessary fields for the user and post
                    $project: {
                        userId: 1,
                        content: 1,
                        mediaType: 1,
                        mediaUrl: 1,
                        createdAt: 1,
                        isFollowed: 1,
                        followersCount: 1,
                        followedCount: 1,
                        'user.fullName': 1,
                        'user.userName': 1,
                        'user.profileImage': 1,
                    }
                }
            ]);
            console.log('posts :',posts)
            return posts
        } catch (error) {
            console.log(error)
        } 
    }

}