import { IAdminRepository } from "../../interfaces/admin/IAdminRepository"
import User from "../../models/userModel"

export const fetchUsers = async():Promise<any> => {
    return await User.find()
}

export class AdminRepository implements IAdminRepository {
    
}