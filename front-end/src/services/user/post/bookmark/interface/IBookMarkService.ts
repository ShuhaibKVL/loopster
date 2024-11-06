export interface IBookMarkService{
    create(userId:string,postId:string):Promise<unknown>
    delete(userId:string,postId:string):Promise<unknown>
}