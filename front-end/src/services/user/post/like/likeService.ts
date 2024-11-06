import { postApi } from "@/services/apis/axiosInstance";
import { ILikeService } from "./interface/ILikeService";

export class LikeService implements ILikeService{
    async like(userId: string, postId: string): Promise<unknown> {
        const response = await postApi.post(`/like?postId=${postId}&userId=${userId}`)
        return response.data
    }

    async unlike(postId: string,userId:string): Promise<unknown> {
        const response = await postApi.delete(`/unlike?postId=${postId}&userId=${userId}`)
        return response.data
    }
}

const likeService = new LikeService()
export default likeService