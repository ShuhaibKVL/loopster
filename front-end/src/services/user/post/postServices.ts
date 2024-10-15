import { IPost } from "@/app/utils/interfaces/IPost";
import { IPostServices } from "./interfaces/IPostServices";
import { postApi, userApi } from "@/services/apis/axiosInstance";

export class PostService implements IPostServices {

    async createPost(data: IPost): Promise<any> {
        const res = await postApi.post('/create',data)
        return res.data
    }

    async deletePost(postId: string): Promise<any> {
        
    }

}

const postService = new PostService()
export default postService