import { IComment } from "../../../models/comment"

export interface IPostCommentsService{
    createComment(data:IComment):Promise<unknown>
    getComments(postId:string):Promise<unknown>
    deleteComment(comment_id:string):Promise<unknown>
    Like(commentId:string,userId:string):Promise<unknown>
    unlike(commentId:string,userId:string):Promise<unknown>
}