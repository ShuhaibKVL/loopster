import { IPost } from "@/app/utils/interfaces/IPost";
import { IPostServices } from "./interfaces/IPostServices";
import { postApi, userApi } from "@/services/apis/axiosInstance";

export class PostService implements IPostServices {

    async createPost(formData: IPost): Promise<any> {
        const res = await postApi.post('/create',formData ,{
            headers:{
                'Content-Type': 'multipart/form-data',
            }
        })
        return res.data
    }

    async deletePost(postId: string): Promise<any> {
        const res = await postApi.delete(`/delete?postId=${postId}`)
        return res.data
    }

    async getLatestPosts(userId:string): Promise<any> {
        const res = await postApi.get(`/${userId}/get-latest-posts`)
        return res.data
    }

}

const postService = new PostService()
export default postService