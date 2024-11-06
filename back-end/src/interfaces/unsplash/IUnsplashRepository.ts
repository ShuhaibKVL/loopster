export interface IUnsplashRepository {
    searchPhotos(query:string,page:number,perPage:number):Promise<any>
}