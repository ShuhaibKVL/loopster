export interface IPostManagementService{
    fetchAllPosts(page:number):Promise<unknown>
    listUnList(postId:string):Promise<unknown>
    reportPost(postId:string,reportId:string):Promise<unknown>
    findMostLikedPost():Promise<unknown>
}