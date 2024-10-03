import User, { IUser } from "../models/userModel"

export const fetchUsers = async():Promise<any> => {
    return await User.find()
}