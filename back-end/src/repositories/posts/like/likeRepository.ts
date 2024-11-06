import { Console } from "console";
import { ILikeRepository } from "../../../interfaces/posts/likes/ILikeRepository";
import Like, { ILike } from "../../../models/Like";

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

}