
import { IPostRepository } from "../../interfaces/posts/IPostRepository";
import Post, { IPost } from "../../models/Post";

export class PostRepository implements IPostRepository {
    async create(data: IPost): Promise<any> {
            const response = await Post.create(data)
            console.log('respnse inside repo :',response)
            return response
    }

    async delete(postId: string): Promise<any> {
        
    }
}