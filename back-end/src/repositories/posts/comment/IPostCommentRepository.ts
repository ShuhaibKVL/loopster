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
                {$match:{postId:new mongoose.Types.ObjectId(postId) }},
                {
                    $lookup:{
                        from:'users',
                        localField:'userId',
                        foreignField:'_id',
                        as:'user'
                    },
                },
                {$unwind:'$user'},
                {
                    $project:{
                        _id:1,
                        postId:1,
                        comment:1,
                        createdAt:1,
                        userId:1,
                        'user.userName':1,
                        'user.profileImage':1
                    }
                }
            ])
        } catch (error) {
            console.log(error)
        }
    }

    async deleteComment(comment_id: string): Promise<unknown> {
        return await Comment.findByIdAndDelete(comment_id)
    }

}