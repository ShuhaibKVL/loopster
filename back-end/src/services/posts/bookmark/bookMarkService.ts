import { IBookMarkRepository } from "../../../interfaces/posts/bookmark/IBookMarkRepository";
import { IBookMarkService } from "../../../interfaces/posts/bookmark/IBookMarkService";

export class BookMarkService implements IBookMarkService{
    constructor(
        private bookMarkRepository : IBookMarkRepository
    ){}

    async create(userId: string, postId: string): Promise<unknown> {
        return await this.bookMarkRepository.create(userId,postId)
    }

    async delete(userId: string, postId: string): Promise<unknown> {
        return await this.bookMarkRepository.delete(userId,postId)
    }
}