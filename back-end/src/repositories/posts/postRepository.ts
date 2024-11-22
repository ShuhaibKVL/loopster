
import mongoose from "mongoose";
import { IPostRepository } from "../../interfaces/posts/IPostRepository";
import Post, { IPost } from "../../models/Post";
import Report, { IReport } from "../../models/Report";
import User from "../../models/userModel";
import Follow from "../../models/followCollectionModal";
import Like from "../../models/Like";
import Bookmark from "../../models/Bookmark";

export class PostRepository implements IPostRepository {
    async create(data: IPost): Promise<any> {
        console.log('post repo')
        return  await Post.create(data)
    }

    async findPostById(id: string): Promise<unknown> {
        return await Post.findById(id)
    }

    async delete(postId: string): Promise<any> {
        return await Post.findByIdAndUpdate(postId,{isList:false})
    }

    async update(content: string, postId: string): Promise<unknown> {
        console.log('update repo :-',content,postId)
        try {
            const update =  await Post.findByIdAndUpdate(postId , {content:content},{new:true}) 
            console.log('update :',update)
            return update
        } catch (error) {
            console.log(error)
            return false
        }
         
    }

    async report(data:IReport): Promise<unknown> {
        try {
            await Report.create(data)
            await User.findByIdAndUpdate(data?.userId,{$push:{reportedPosts:data?.postId}},{new:true})
            return true
        } catch (error) {
            console.log(error)
        }
    }

    async findLatestPosts(userId: string,page:number): Promise<any> {
        console.log('user id:',userId)
        try {
            const limit = 7
            const user = await User.findById(userId,{reportedPosts:1})
            const posts = await Post.aggregate([
                {
                    $match: {
                        $expr: {
                            $not: {
                                $in: [
                                    '$_id',
                                    user?.reportedPosts?.map((id) => new mongoose.Types.ObjectId(id)) || []
                                ]
                            }
                        },
                        isList: true,
                        isReported: false
                    }
                },
                {
                    // Sort the posts by the latest first
                    $sort: { createdAt: -1 }
                },
                {
                    // Convert the `userId` field (string) to `ObjectId` for lookup
                    $addFields: {
                        userObjectId: { $toObjectId: "$userId" }
                    }
                },
                {
                    // Lookup to check if the current user has liked the post
                    $lookup: {
                        from: 'likes',
                        let: { postId:{$toString:'$_id'}, currentUserId:userId },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$postId', '$$postId'] },
                                            { $eq: ['$userId', '$$currentUserId'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1 } } // Only project _id for existence check
                        ],
                        as: 'likeInfo'
                    }
                },
                {
                    // Add an `isLiked` field to indicate if the current user has liked this post
                    $addFields: {
                        isLiked: { $gt: [{ $size: '$likeInfo' }, 0] }
                    }
                },
                {
                    // Lookup to check if the current user has liked the post
                    $lookup: {
                        from: 'bookmarks',
                        let: { postId:{$toString:'$_id'}, currentUserId:userId },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$postId', '$$postId'] },
                                            { $eq: ['$userId', '$$currentUserId'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1 } } // Only project _id for existence check
                        ],
                        as: 'bookMarkInfo'
                    }
                },
                {
                    // Add an `isLiked` field to indicate if the current user has liked this post
                    $addFields: {
                        isBookMarked: { $gt: [{ $size: '$bookMarkInfo' }, 0] }
                    }
                },
                {
                    // Add an `isLiked` field to indicate if the current user has liked this post
                    $addFields: {
                        isLiked: { $gt: [{ $size: '$likeInfo' }, 0] }
                    }
                },
                {
                    $lookup:{
                        from:'likes',
                        let: { postId: '$_id' },   
                        pipeline: [
                            {
                              $addFields: {
                                postIdObjectId: { $toObjectId: '$postId' }  // Convert postId in Like collection to ObjectId
                              }
                            },
                            {
                              $match: {
                                $expr: { $eq: ['$postIdObjectId', '$$postId'] } // Match the converted field with Post._id
                              }
                            }
                          ],
                        as:'likes'
                    }
                },
                {
                    $addFields: {
                      likeCount: { $size: '$likes' } // Count the number of items in the 'likes' array
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
                    $skip:((limit * page) - limit)
                },
                {
                    $limit:limit
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
                        isReported:1,
                        isLiked:1,
                        likes:1,
                        likeInfo:1,
                        likeCount:1,
                        isBookMarked:1,
                        bookMarkInfo:1,
                        'user.fullName': 1,
                        'user.userName': 1,
                        'user.profileImage': 1,
                    }
                }
            ]);
            console.log('the one posts exaple :',posts[0],posts.length)
            return posts
        } catch (error) {
            console.log(error)
        } 
    }

    async findFollowedUserPost(userId: string, page: number): Promise<unknown> {
        try {
            const limit = 7
            const user = await User.findById(userId,{reportedPosts:1})
            const followedUsers = await Follow.find({follower:userId},{follower:0,_id:0})
            // Extract the followed user IDs into an array
            const followedUserIds = followedUsers.map(follow => follow.following.toString());

            console.log("followedUser :",followedUserIds)

            const posts = await Post.aggregate([
                {
                    $match: {
                        $and: [
                            { 
                                isList: true,
                                isReported: false,
                                userId: { $in: followedUserIds } // Match posts from followed users only
                            },
                            {
                                $expr: {
                                    $not: {
                                        $in: [
                                            '$_id',
                                            user?.reportedPosts?.map((id) => new mongoose.Types.ObjectId(id)) || []
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    // Sort the posts by the latest first
                    $sort: { createdAt: -1 }
                },
                {
                    // Convert the `userId` field (string) to `ObjectId` for lookup
                    $addFields: {
                        userObjectId: { $toObjectId: "$userId" }
                    }
                },
                {
                    // Lookup to check if the current user has liked the post
                    $lookup: {
                        from: 'likes',
                        let: { postId:{$toString:'$_id'}, currentUserId:userId },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$postId', '$$postId'] },
                                            { $eq: ['$userId', '$$currentUserId'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1 } } // Only project _id for existence check
                        ],
                        as: 'likeInfo'
                    }
                },
                {
                    // Add an `isLiked` field to indicate if the current user has liked this post
                    $addFields: {
                        isLiked: { $gt: [{ $size: '$likeInfo' }, 0] }
                    }
                },
                {
                    $lookup:{
                        from:'likes',
                        let: { postId: '$_id' },   
                        pipeline: [
                            {
                              $addFields: {
                                postIdObjectId: { $toObjectId: '$postId' }  // Convert postId in Like collection to ObjectId
                              }
                            },
                            {
                              $match: {
                                $expr: { $eq: ['$postIdObjectId', '$$postId'] } // Match the converted field with Post._id
                              }
                            }
                          ],
                        as:'likes'
                    }
                },
                {
                    $addFields: {
                      likeCount: { $size: '$likes' } // Count the number of items in the 'likes' array
                    }
                },
                {
                    // Lookup to check if the current user has liked the post
                    $lookup: {
                        from: 'bookmarks',
                        let: { postId:{$toString:'$_id'}, currentUserId:userId },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$postId', '$$postId'] },
                                            { $eq: ['$userId', '$$currentUserId'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1 } } // Only project _id for existence check
                        ],
                        as: 'bookMarkInfo'
                    }
                },
                {
                    // Add an `isLiked` field to indicate if the current user has liked this post
                    $addFields: {
                        isBookMarked: { $gt: [{ $size: '$bookMarkInfo' }, 0] }
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
                    $skip:((limit * page) - limit)
                },
                {
                    $limit:limit
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
                        isReported:1,
                        isLiked:1,
                        isBookMarked:1,
                        bookMarkInfo:1,
                        likes:1,
                        likeCount:1,
                        'user.fullName': 1,
                        'user.userName': 1,
                        'user.profileImage': 1,
                    }
                }
            ]);
            console.log('the one FOLLOWED USER POST EXP  :',posts[0],posts.length)
            return posts

        } catch (error) {
           console.log(error) 
        }
    }

    async findBookMarkedPosts(userId: string,page:number): Promise<unknown> {
        try {
            const limit = 7
            const user = await User.findById(userId,{reportedPosts:1})
            const bookMarkedPosts = await Bookmark.find({userId:userId})
            // Extract the followed user IDs into an array
            const bookMarkedPostsId = bookMarkedPosts.map(post => new mongoose.Types.ObjectId(post?.postId));

            console.log("bookMarkedPostsId :",bookMarkedPostsId)

            const posts = await Post.aggregate([
                {
                    $match: {
                        $and: [
                            { 
                                isList: true,
                                isReported: false,
                                _id: { $in: bookMarkedPostsId }, // Match posts from followed users only
                            },
                            {
                                $expr: {
                                    $not: {
                                        $in: [
                                            '$_id',
                                            user?.reportedPosts?.map((id) => new mongoose.Types.ObjectId(id)) || []
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    // Sort the posts by the latest first
                    $sort: { createdAt: -1 }
                },
                {
                    // Convert the `userId` field (string) to `ObjectId` for lookup
                    $addFields: {
                        userObjectId: { $toObjectId: "$userId" }
                    }
                },
                {
                    // Lookup to check if the current user has liked the post
                    $lookup: {
                        from: 'likes',
                        let: { postId:{$toString:'$_id'}, currentUserId:userId },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$postId', '$$postId'] },
                                            { $eq: ['$userId', '$$currentUserId'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1 } } // Only project _id for existence check
                        ],
                        as: 'likeInfo'
                    }
                },
                {
                    // Add an `isLiked` field to indicate if the current user has liked this post
                    $addFields: {
                        isLiked: { $gt: [{ $size: '$likeInfo' }, 0] }
                    }
                },
                {
                    // Lookup to check if the current user has liked the post
                    $lookup: {
                        from: 'bookmarks',
                        let: { postId:{$toString:'$_id'}, currentUserId:userId },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$postId', '$$postId'] },
                                            { $eq: ['$userId', '$$currentUserId'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1 } } // Only project _id for existence check
                        ],
                        as: 'bookMarkInfo'
                    }
                },
                {
                    // Add an `isLiked` field to indicate if the current user has liked this post
                    $addFields: {
                        isBookMarked: { $gt: [{ $size: '$bookMarkInfo' }, 0] }
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
                    $skip:((limit * page) - limit)
                },
                {
                    $limit:limit
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
                        isReported:1,
                        isLiked:1,
                        isBookMarked:1,
                        bookMarkInfo:1,
                        'user.fullName': 1,
                        'user.userName': 1,
                        'user.profileImage': 1,
                    }
                }
            ]);
            console.log('the one FOLLOWED USER POST EXP  :',posts,posts.length)
            return posts
            } catch (error) {
                console.log(error) 
             }
    }
}