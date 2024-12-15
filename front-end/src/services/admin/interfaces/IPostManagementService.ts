export interface IPostManagementService{
    fetchAllPosts(page:number):Promise<any>
    listUnList(postId:string):Promise<unknown>
    reportPost(postId:string,reportId:string):Promise<unknown>
    findMostLikedPost():Promise<unknown>
}