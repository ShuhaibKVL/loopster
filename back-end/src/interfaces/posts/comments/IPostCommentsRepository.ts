import { IComment } from "../../../models/comment"

export interface IPostCommentsRepository{
    createComment(data:IComment):Promise<unknown>
    findComments(postId:string):Promise<unknown>
    deleteComment(comment_id:string):Promise<unknown>
}