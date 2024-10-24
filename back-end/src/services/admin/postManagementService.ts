import { IPostManagementRepository } from "../../interfaces/admin/postManagement/IPostManagementRepository";
import { IPostManagementService } from "../../interfaces/admin/postManagement/IPostManagementService";

export class PostManagementService implements IPostManagementService {
    constructor(
        private postMangementRepository : IPostManagementRepository
    ){}

    async getAllPosts(): Promise<any> {
        return await this.postMangementRepository.fetchAllPosts()
    }
}