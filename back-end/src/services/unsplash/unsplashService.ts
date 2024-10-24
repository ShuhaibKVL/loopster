import { IUnsplashRepository } from "../../interfaces/unsplash/IUnsplashRepository";
import { IUnsplashService } from "../../interfaces/unsplash/IUnsplashService";

export class UnsplashService implements IUnsplashService {
    constructor(
        private unsplashRepository : IUnsplashRepository
    ){}

    async searchPhotos(query: string, page: number, perPage: number): Promise<any> {
        return await this.unsplashRepository.searchPhotos(query,page,perPage)
    }
}