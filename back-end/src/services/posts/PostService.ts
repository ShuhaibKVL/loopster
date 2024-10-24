import { IPostRepository } from "../../interfaces/posts/IPostRepository";
import { IPostService } from "../../interfaces/posts/IPostServices";
import { IS3Service } from "../../interfaces/S3/IS3Service";
import { IPost } from "../../models/Post";

export class PostService implements IPostService {
    constructor(
        private postRepository : IPostRepository,
        private s3Service : IS3Service
    ){}

    async createPost(data: IPost ,file : Buffer,fileName:string): Promise<any> {
        console.log('create post service invoked',data)
        const imageUrl = await this.s3Service.uploadFile(file,fileName)
        data.mediaUrl = imageUrl
        if(imageUrl){
            return await this.postRepository.create(data)
        }
        return false
    }

    async deletePost(postId: string): Promise<any> {
        return await this.postRepository.delete(postId)
    }

    async getLatestPosts(userId: string): Promise<any> {
        console.log('latest post service invoked')
        return await this.postRepository.findLatestPosts(userId)
    }
}