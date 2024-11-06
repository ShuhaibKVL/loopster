import { IPost } from "@/lib/utils/interfaces/IPost";
import { postApi } from "@/services/apis/axiosInstance";
import { IPostServices } from "./interfaces/IPostServices";
import { IReport } from "@/lib/utils/interfaces/IReport";
import { IPostProps } from "@/lib/utils/interfaces/PostProps";
import { PostProps } from "@/app/components/post_components/Post";

export class PostService implements IPostServices {

    async createPost(formData: IPost | FormData): Promise<any> {
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

    async report(data: IReport): Promise<unknown> {
        const res = await postApi.post(`/report-post`,data)
        return res.data
    }

    async getLatestPosts(userId:string,page?:number): Promise<any> {
        console.log('iniside the post service :',userId,"page :",page)
        const res = await postApi.get(`/${userId}/get-latest-posts?page=${page}`)
        return res.data
    }

    async getFollowedUserPosts(userId: string, page?: number): Promise<unknown> {
        const res = await postApi.get(`/${userId}/followed-users-post?page=${page}`)
        return res.data
    }

    async getBookMarkedPosts(userId: string, page?: number): Promise<{message:string,posts:IPostProps[]}> {
        const res = await postApi.get(`/${userId}/book-mark/get_all?page=${page}`)
        return res.data
    }

}

const postService = new PostService()
export default postService