import { adminApi } from "../apis/axiosInstance";
import { IPostManagementService } from "./interfaces/IPostManagementService";

export class PostMangementService implements IPostManagementService {
    async fetchAllPosts(): Promise<any> {
        const response = await adminApi.get('/post/all-posts')
        return response
    }
}

const postManagementService = new PostMangementService()
export default postManagementService

