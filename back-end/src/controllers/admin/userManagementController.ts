import { Request, Response, NextFunction } from "express";
import { IUserManagementController } from "../../interfaces/admin/userManagment/IUserManagementController";
import { IUserManagementService } from "../../interfaces/admin/userManagment/IUserManagmentService";
import { HttpStatus } from "../../enums/httpStatus";
import { SuccessMessages } from "../../enums/successMessages";
import { ErrorMessages } from "../../enums/errorMessages";

export class UserManagementController implements IUserManagementController {

    constructor(
        private userManagementService : IUserManagementService
    ){}
    
    async getAllUsers(req: Request, res: Response): Promise<void> {
        console.log('get all users invoked ')
        try {
            const users = await this.userManagementService.getAllUsers()
            if(!users){
                res.status(HttpStatus.BAD_REQUEST)
            }
            res.status(HttpStatus.OK).json({userData:users})

        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async blockUnBlock(req: Request, res: Response): Promise<void> {
        try {
            console.log('block unblock controller invoked');
            const userId = req.params.userId;
            console.log('userId :', userId);
            if (!userId) {
            res.status(HttpStatus.BAD_REQUEST).json({ message: ErrorMessages.USER_ID_NOT_FONT });
            return;
            }
            await this.userManagementService.blockUnBlock(userId);
            console.log('User block/unblock successful');
            res.status(HttpStatus.OK).json({ message: 'User block/unblock successful' });
        } catch (error:any) {
            console.error('Error in Controller:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async listUnList(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId
            if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({message:ErrorMessages.USER_ID_NOT_FONT})
            }
            await this.userManagementService.listUnList(userId)
            res.status(HttpStatus.OK).json({message:'User list/UnList successful'})
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }
}