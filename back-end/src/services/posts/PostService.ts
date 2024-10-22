import { IPostRepository } from "../../interfaces/posts/IPostRepository";
import { IPostService } from "../../interfaces/posts/IPostServices";
import { IPost } from "../../models/Post";

export class PostService implements IPostService {
    constructor(
        private userRepository : IPostRepository
    ){}

    async createPost(data: IPost): Promise<any> {
        console.log('create post service invoked')
        return await this.userRepository.create(data)
    }

    async deletePost(data: IPost): Promise<any> {
        
    }
}