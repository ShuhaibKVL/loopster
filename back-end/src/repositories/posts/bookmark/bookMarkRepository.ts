import { IBookMarkRepository } from "../../../interfaces/posts/bookmark/IBookMarkRepository";
import Bookmark from "../../../models/Bookmark";


export class BookMarkRepository implements IBookMarkRepository{
    async create(userId: string, postId: string): Promise<unknown> {
        const data = {
            userId:userId,
            postId:postId
        }
        return await Bookmark.create(data)
    }

    async delete(userId: string, postId: string): Promise<unknown> {
        return await Bookmark.deleteOne({userId:userId,postId:postId})
    }
}