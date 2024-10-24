export interface IUnsplashService {
    searchPhotos(query:string,page:number,perPage:number):Promise<any>
}