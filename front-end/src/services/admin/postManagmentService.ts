import { ITopLikedPost } from "@/components/DashBoard/TopLikedPosts";
import { adminApi } from "../apis/axiosInstance";
import { IPostManagementService } from "./interfaces/IPostManagementService";
import { IPostTable } from "@/hooks/customHooks/usePosts";

export class PostMangementService implements IPostManagementService {
    async fetchAllPosts(page:number): Promise<{posts:{posts :IPostTable[],totalPosts:number,newReported:number,unListed:number,reported:number,totalPages:number}}> {
        const response = await adminApi.get(`/post/all-posts?page=${page}`)
        return response.data
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

    async findMostLikedPost(): Promise<{status:boolean,data:ITopLikedPost[]}> {
        const response = await adminApi.get('/post/most-liked-posts')
        return response?.data
    }

    
}

const postManagementService = new PostMangementService()
export default postManagementService

