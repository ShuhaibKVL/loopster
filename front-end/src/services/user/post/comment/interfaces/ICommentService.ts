import { IComment } from "@/lib/utils/interfaces/IComment";

export interface ICommentService{
    createComment(data:IComment):Promise<unknown>
    getPostComments(postId:string):Promise<unknown>
    deleteComment(comment_id:string):Promise<unknown>
}