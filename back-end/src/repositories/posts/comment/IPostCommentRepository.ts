import mongoose from "mongoose";
import { IPostCommentsRepository } from "../../../interfaces/posts/comments/IPostCommentsRepository";
import Comment, { IComment } from "../../../models/comment";

export class PostCommentsRepository implements IPostCommentsRepository{

    async createComment(data:IComment): Promise<unknown> {
        return await Comment.create(data)
    }

    async findComments(postId: string): Promise<unknown> {
        try {
            return await Comment.aggregate([
                { 
                    $match: { postId: new mongoose.Types.ObjectId(postId) } 
                },
                {
                    $lookup: {
                        from: 'users', // Lookup user data for main comments
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    },
                },
                { 
                    $unwind: '$user' // Unwind the user array to merge its fields
                },
                {
                    $lookup: {
                        from: 'comments', // Lookup inner comments for each comment
                        localField: '_id',
                        foreignField: 'postId',
                        as: 'innerComments'
                    }
                },
                {
                    $unwind: { // Preserve comments with no innerComments
                        path: '$innerComments',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: { // Lookup user data for innerComments
                        from: 'users',
                        localField: 'innerComments.userId',
                        foreignField: '_id',
                        as: 'innerComments.user'
                    }
                },
                {
                    $unwind: { // Unwind innerComments.user array for each inner comment
                        path: '$innerComments.user',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: { // Regroup innerComments back into an array
                        _id: '$_id',
                        postId: { $first: '$postId' },
                        comment: { $first: '$comment' },
                        createdAt: { $first: '$createdAt' },
                        userId: { $first: '$userId' },
                        likes: { $first: '$likes' },
                        user: { $first: '$user' },
                        innerComments: { $push: '$innerComments' }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        likes:1,
                        postId: 1,
                        comment: 1,
                        createdAt: 1,
                        userId: 1,
                        user: {
                            userName: 1,
                            profileImage: 1
                        },
                        innerComments: {
                            _id: 1,
                            postId: 1,
                            comment: 1,
                            userId:1,
                            likes:1,
                            createdAt: 1,
                            user: { userName: 1, profileImage: 1 }
                        }
                    }
                }
            ]);
            
        } catch (error) {
            console.log(error)
        }
    }

    async deleteComment(comment_id: string): Promise<unknown> {
        return await Comment.findByIdAndDelete(comment_id)
    }

    async Like(commentId: string, userId: string): Promise<unknown> {
        return await Comment.findByIdAndUpdate(commentId,{$push:{likes:userId}},{new:true})
    }

    async unlike(commentId: string, userId: string): Promise<unknown> {
        return await Comment.findByIdAndUpdate(commentId,{$pull:{likes:userId}},{new:true})
    }
}