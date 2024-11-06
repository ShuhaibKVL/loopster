import { adminApi } from "../apis/axiosInstance";
import { IPostManagementService } from "./interfaces/IPostManagementService";

export class PostMangementService implements IPostManagementService {
    async fetchAllPosts(page:number): Promise<any> {
        const response = await adminApi.get(`/post/all-posts?page=${page}`)
        return response
    }

    async listUnList(postId: string): Promise<unknown> {
        const response = await adminApi.patch(`/post/list-unlist?postId=${postId}`)
        return response.data
    }

    async reportPost(postId: string,reportId:string): Promise<unknown> {
        console.log('postIs:,',postId,"reportId:",reportId)
        const response = await adminApi.patch(`/post/report-post?postId=${postId}&reportId=${reportId}`)
        return response.data
    }
}

const postManagementService = new PostMangementService()
export default postManagementService

