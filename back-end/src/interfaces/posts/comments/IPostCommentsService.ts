import { IComment } from "../../../models/comment"

export interface IPostCommentsService{
    createComment(data:IComment):Promise<unknown>
    getComments(postId:string):Promise<unknown>
    deleteComment(comment_id:string):Promise<unknown>
}