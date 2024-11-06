export interface ILikeService{
    like(userId:string,postId:string):Promise<unknown>
    unlike(postId:string,userId:string):Promise<unknown>
}