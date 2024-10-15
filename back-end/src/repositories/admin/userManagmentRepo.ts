import { IUserManagementRepository } from "../../interfaces/admin/userManagment/IUserManagementRepository";
import User from "../../models/userModel";

export class UserManagementRepo implements IUserManagementRepository {

    async findAllUsers(): Promise<any> {
        return await User.find({})
    }

    async updateIsBlock(userId: string): Promise<any> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        console.log('block repo invoked');
        try {
            const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { isBlocked: !user.isBlocked } },
            { new: true }
            );
        console.log('updatedUser :', updatedUser);
        return true;
        } catch (error) {
            console.error('Error in Repository:', error);
            throw error; // Rethrow to be caught by service
        }
    }


    async updateIsList(userId: string): Promise<any> {
        console.log('update list repository invoked.')
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { isList: !user.isList } },
            { new: true }
        );

        console.log("updateUser :",updatedUser)

        return updatedUser;
    }
}