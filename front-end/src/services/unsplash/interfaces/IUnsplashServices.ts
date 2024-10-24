export interface IUnsplashService {
    searchImages(page:number,query:string,per_page:number):Promise<any>
}