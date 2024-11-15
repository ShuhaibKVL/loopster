import { ILikeRepository } from "../../../interfaces/posts/likes/ILikeRepository";
import { ILikeService } from "../../../interfaces/posts/likes/ILikeService";
import { ILike } from "../../../models/Like";

export class LikeService implements ILikeService{
    constructor(
        private likeRepository : ILikeRepository
    ){}

    async createLike(data: ILike): Promise<unknown> {
        return await this.likeRepository.like(data)
    }

    async removeLike(postId: string,userId:string): Promise<unknown> {
        return await this.likeRepository.unLike(postId,userId)
    }

    async likedPostsUsers(postId: string): Promise<unknown> {
        return await this.likeRepository.likedPostsUsers(postId)
    }
}