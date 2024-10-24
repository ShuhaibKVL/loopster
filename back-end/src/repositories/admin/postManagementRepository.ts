import { IPostManagementRepository } from "../../interfaces/admin/postManagement/IPostManagementRepository";
import Post from "../../models/Post";

export class PostManagementRepository implements IPostManagementRepository {

    async fetchAllPosts(): Promise<any> {  
        try {
            const posts = await Post.aggregate([
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $project: {
                        userId: 1,
                        content: 1,
                        mediaType: 1,
                        mediaUrl: 1,
                        createdAt: 1,
                    }
                }
            ]);
            console.log('all posts :',posts)
            return posts
        } catch (error) {
            console.log(error)
            return false
        }
    }
}