import { IUserManagementRepository } from "../../interfaces/admin/userManagment/IUserManagementRepository";
import { IUserManagementService } from "../../interfaces/admin/userManagment/IUserManagmentService";

export class UserManagementService implements IUserManagementService {
    constructor(
        private userManagementRepo : IUserManagementRepository
    ){}

    async getAllUsers(page:number): Promise<any> {
        return await this.userManagementRepo.findAllUsers(page)
    }

    async blockUnBlock(userId: string): Promise<any> {
        console.log('block user service invoked');
        try {
            const result = await this.userManagementRepo.updateIsBlock(userId);
            console.log('Service result:', result);
            return result;
        } catch (error) {
            console.error('Error in Service:', error);
          throw error; // Rethrow to be caught by controller
        }
    }

    async listUnList(userId: string): Promise<any> {
        console.log('listUnlist service invoked..')
        return await this.userManagementRepo.updateIsList(userId)
    }
}