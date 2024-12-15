import { Request, Response } from "express";
import { IUserManagementController } from "../../interfaces/admin/userManagment/IUserManagementController";
import { IUserManagementService } from "../../interfaces/admin/userManagment/IUserManagmentService";
import { HttpStatus } from "../../enums/httpStatus";
import { ErrorMessages } from "../../enums/errorMessages";

export class UserManagementController implements IUserManagementController {

    constructor(
        private userManagementService : IUserManagementService
    ){}
    
    async getAllUsers(req: Request, res: Response): Promise<void> {
        console.log('get all users invoked ')
        try {
            const page = req.query.page
            const users = await this.userManagementService.getAllUsers(Number(page))
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

    // to show all total users on admin dashboard panel
    async getTotalAccountsCount(req:Request,res:Response):Promise<unknown> {
        try {
           const respnse =  await this.userManagementService.getTotalAccountsCount()
           if (!respnse) {
            res.status(HttpStatus.BAD_REQUEST).json({ message:'Falied to fetch total uses count' ,status:false});
            return;
            }
            res.status(HttpStatus.OK).json({message:'successful',status:true,totalUsers:respnse})
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async findUsersBasedOnDays(req:Request,res:Response): Promise<unknown> {
        try {
            const respnse =  await this.userManagementService.findUsersBasedOnDays()
            if (!respnse) {
             res.status(HttpStatus.BAD_REQUEST).json({ message:'Falied to fetch total uses count' ,status:false});
             return;
             }
             res.status(HttpStatus.OK).json({message:'successful',status:true,users:respnse})
         } catch (error:any) {
             console.log(error)
             res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
         }
    }

    // for user data 
    async findById(req:Request,res:Response):Promise<unknown> {
        try {
            const { userId } = req.query
            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ message:'userId is missing' ,status:false});
                return;
            }

           const respnse =  await this.userManagementService.findById(userId as string)
           if (!respnse) {
            res.status(HttpStatus.BAD_REQUEST).json({ message:'Falied to fetch total uses count' ,status:false});
            return;
            }
            res.status(HttpStatus.OK).json({message:'successful',status:true,user:respnse})
        } catch (error:any) {
            console.log(error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

}