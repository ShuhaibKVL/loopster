export interface IBookMarkRepository {
    create(userId:string,postId:string):Promise<unknown>
    delete(userId:string,postId:string):Promise<unknown>
}