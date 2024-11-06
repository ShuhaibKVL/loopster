import { postApi } from "@/services/apis/axiosInstance";
import { IBookMarkService } from "./interface/IBookMarkService";

export class BookMarkService implements IBookMarkService{
    async create(userId: string, postId: string): Promise<unknown> {
        const response = await postApi.post(`/book-mark/create?userId=${userId}&postId=${postId}`)
        return response?.data
    }

    async delete(userId: string, postId: string): Promise<unknown> {
        const response = await postApi.delete(`/book-mark/delete?userId=${userId}&postId=${postId}`)
        return response?.data
    }
}

const bookMarkService = new BookMarkService()
export default bookMarkService