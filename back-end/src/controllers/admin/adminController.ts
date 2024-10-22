import { Response,Request, NextFunction } from "express"
import { 
    // adminSignIn,
     getAllUsers,
      IAdmin 
    } from "../../services/admin/adminServices"
import { IAdminController } from "../../interfaces/admin/IAdminController"
import { IAdminService } from "../../interfaces/admin/IAdminService"
import { HttpStatus } from "../../enums/httpStatus"
import { SuccessMessages } from "../../enums/successMessages"
import { ErrorMessages } from "../../enums/errorMessages"
import { IAuthService } from "../../interfaces/IAuthService"

export class AdminController implements IAdminController {
    constructor(
        private adminService : IAdminService,
        private authService: IAuthService
    ){}
    
    async signIn(req: Request, res: Response): Promise<void> {
        try {
            const formData = req.body
            console.log('formData :',formData,"name :",formData.name)
            const admin = await this.adminService.signIn(formData)
            console.log('admin :',admin)
            if(admin){
                const token = this.authService.generateToken(formData.email,'1h')

                res.status(HttpStatus.OK).json({message:SuccessMessages.LOGIN_SUCCESSFUL,email:formData.email,accessToken:token,})
            }else{
                res.status(HttpStatus.UNAUTHORIZED).json({message:ErrorMessages.INVALID_CREDENTIAL})
            }
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }
}