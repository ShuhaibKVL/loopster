import { IUnsplashRepository } from "../../interfaces/unsplash/IUnsplashRepository";

export class UnsplashRepository implements IUnsplashRepository {

    async searchPhotos(query: string, page: number, perPage: number): Promise<any> {
        const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

        const data = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${ACCESS_KEY}&per_page=${perPage}`)
        console.log('response inside the unsplashRepository :',data)

        const dataJ = await data.json()
        const result = dataJ.results
        console.log('result of unsplash :',result)

        return result
    }
}