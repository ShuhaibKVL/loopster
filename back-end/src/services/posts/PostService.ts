import { IPostRepository } from "../../interfaces/posts/IPostRepository";
import { IPostService } from "../../interfaces/posts/IPostServices";
import { IS3Service } from "../../interfaces/S3/IS3Service";
import { IPost } from "../../models/Post";
import { IReport } from "../../models/Report";

export class PostService implements IPostService {
    constructor(
        private postRepository : IPostRepository,
        private s3Service : IS3Service
    ){}

    async createPost(data: IPost ,file : Buffer,fileName:string): Promise<any> {
        const imageUrl = await this.s3Service.uploadFile(file,fileName)
        data.mediaUrl = imageUrl
        if(imageUrl){
            return await this.postRepository.create(data)
        }
        return false
    }

    async findPostById(id: string): Promise<unknown> {
        return await this.postRepository.findPostById(id)
    }

    async deletePost(postId: string): Promise<any> {
        return await this.postRepository.delete(postId)
    }

    async update(content: string, postId: string): Promise<unknown> {
        return await this.postRepository.update(content,postId)
    }

    async reportPost(data: IReport): Promise<unknown> {
        return await this.postRepository.report(data)
    }

    async getLatestPosts(userId: string,page:number): Promise<any> {
        console.log('latest post service invoked',page)
        return await this.postRepository.findLatestPosts(userId,page)
    } 
    
    async getFollowedUsersPosts(userId: string, page: number): Promise<any> {
        return await this.postRepository.findFollowedUserPost(userId,page)
    }

    async getBookMarkedPosts(userId: string,page:number): Promise<unknown> {
        return await this.postRepository.findBookMarkedPosts(userId,page)
    }
}