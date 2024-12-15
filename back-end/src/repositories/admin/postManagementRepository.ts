import mongoose, { ClientSession } from "mongoose";
import { IPostManagementRepository } from "../../interfaces/admin/postManagement/IPostManagementRepository";
import Post from "../../models/Post";
import Report from "../../models/Report";
import Like from "../../models/Like";

export class PostManagementRepository implements IPostManagementRepository {

    async fetchAllPosts(page:number): Promise<any> {  
        try {
            const totalPosts = await Post.countDocuments()
            const limit = 10
            const totalPages = Math.ceil(totalPosts / limit)
            
            const newReported = await Report.countDocuments()
            const unListed = await Post.find({isList:false}).countDocuments()
            const reported = await Post.find({isReported:true}).countDocuments()
            
            const posts = await Post.aggregate([
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $skip:((limit * page) - limit)
                },
                {
                    $limit:limit
                }
            ]);

            const res ={
                posts:posts,
                totalPosts:totalPosts,
                newReported:newReported,
                unListed:unListed,
                reported:reported,
                totalPages:totalPages
            }
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async updateList(postId: string): Promise<unknown> {
        const post = await Post.findById(postId)
        return await Post.findByIdAndUpdate(postId,{$set:{isList:!post?.isList}},{new:true})
    }

    async updateIsReport(postId: string,session?:ClientSession): Promise<unknown> {
        console.log('updateIsReport :',postId)
        try {
            const report = await Post.findById(postId)
            console.log('report existed :',report)
            if(report){
                console.log('if')
                report.isReported = !report?.isReported;
                const update = await report.save()
                console.log('update in repository :',update)
                return true
            }
            return false
        } catch (error) {
            console.log(error) 
            return false 
        }
    } 

    async findMostLikedPost(): Promise<unknown> {
        return await Like.aggregate([
            {$group:{_id:{$toObjectId:'$postId'},likeCount:{$sum:1}}},
            {$lookup:{
                from:'posts',
                localField:'_id',
                foreignField:'_id',
                as:'postDetails'
            }},
            {$sort:{likeCount:-1}},
            {$limit:10}
        ])
    }

    async findPostsBasedOnDay(): Promise<unknown> {
        try {
            return await Post.aggregate([
                {$group:
                    {_id:{
                        $dateToString:{format:"%Y-%m-%d",date:"$createdAt"}
                    },
                    posts:{$sum:1}
                }  
                },
                {$sort:{_id:1}}
            ])
        } catch (error) {
            console.log(error)
        }
        
    }

}