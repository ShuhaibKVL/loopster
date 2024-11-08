import { IComment } from "@/lib/utils/interfaces/IComment";
import { ICommentService } from "./interfaces/ICommentService";
import { postApi } from "@/services/apis/axiosInstance";

export class CommentService implements ICommentService{
    async createComment(data: IComment): Promise<unknown> {
        const response = await postApi.post('/comment/create',data)
        console.log('response :',response)
        return response?.data
    }

    async getPostComments(postId: string): Promise<{comments:[],status:boolean}> {
        const response = await postApi.get(`/comment/get-comments?postId=${postId}`)
        return response?.data
    }

    async deleteComment(comment_id:string): Promise<{message:string,status:boolean}> {
        const response = await postApi.delete(`/comment/delete?comment_id=${comment_id}`)
        return await response?.data
    }
}

const commentService = new CommentService()
export default commentService