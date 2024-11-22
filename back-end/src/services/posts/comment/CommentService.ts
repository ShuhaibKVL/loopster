import { IPostCommentsRepository } from "../../../interfaces/posts/comments/IPostCommentsRepository";
import { IPostCommentsService } from "../../../interfaces/posts/comments/IPostCommentsService";
import { IComment } from "../../../models/comment";

export class CommentService implements IPostCommentsService{
    constructor(
        private commentRepository : IPostCommentsRepository
    ){}

    async createComment(data: IComment): Promise<unknown> {
        return await this.commentRepository.createComment(data)
    }

    async getComments(postId: string): Promise<unknown> {
        return await this.commentRepository.findComments(postId)
    }

    async deleteComment(comment_id: string): Promise<unknown> {
        return await this.commentRepository.deleteComment(comment_id)
    }

    async Like(commentId: string, userId: string): Promise<unknown> {
        return await this.commentRepository.Like(commentId,userId)
    }

    async unlike(commentId: string, userId: string): Promise<unknown> {
        return await this.commentRepository.unlike(commentId,userId)
    }
}