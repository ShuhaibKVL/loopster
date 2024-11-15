import { Console } from "console";
import { ILikeRepository } from "../../../interfaces/posts/likes/ILikeRepository";
import Like, { ILike } from "../../../models/Like";
import mongoose from "mongoose";

export class LikeRepository implements ILikeRepository{

    async like(data:ILike): Promise<unknown> {
        try {
            const res =  await Like.create(data)
            console.log(res)
            return res
        } catch (error:any) {
           console.log(error.message) 
        }
    }

    async unLike(postId: string,userId:string): Promise<unknown> {
        try {
            const res = Like.findOneAndDelete({userId:userId,postId:postId})
            console.log(res)
            return res
        } catch (error) {
            console.log(error)
        }
    }

    async likedPostsUsers(postId: string): Promise<unknown> {
        try {
            const res = await Like.aggregate([
                {
                  $match: {
                    postId: postId,
                  },
                },
                {
                    $addFields: {
                        userObjectId: { $toObjectId: "$userId" }
                    }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField:'userObjectId',
                    foreignField:'_id',
                    as: 'userDetails',
                  },
                },
                {
                  $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {$project:{
                    'userDetails.fullName':1,
                     'userDetails.userName':1,
                     'userDetails.profileImage':1,
                     userId:1,
                     postId:1
                }}
              ]);
            console.log('res in repos :',res)
            return res
        } catch (error) {
            console.log(error)
        }
        return 
    }

}