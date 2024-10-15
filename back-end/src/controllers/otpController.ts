import { Request, Response, NextFunction } from "express";
import { IOtpController } from "../interfaces/IOtpController";
import { IOtpService } from "../interfaces/IOtpService";
import { HttpStatus } from "../enums/httpStatus";
import { ErrorMessages } from "../enums/errorMessages";
import { SuccessMessages } from "../enums/successMessages";
import { IEmailService } from "../interfaces/IEmailService";
import { IUserService } from "../interfaces/IUserService";

export class OtpController implements IOtpController{
    constructor(
        private otpService : IOtpService,
        private emailService : IEmailService,
        private userService : IUserService
    ){}

    async verifyOtp(req: Request, res: Response): Promise<any> {
        try {
            const { email , otp } = req.body
            const isVerified = await this.otpService.verifyOtp(email,otp)
            
            const user = await this.userService.findUserByEmail(email)
            //Update user isVerified field to " true "
            await this.userService.verifyUser(user._id)

            if(!isVerified){
                res.status(HttpStatus.NOT_FOUND).json({message:ErrorMessages.INVALID_OTP ,stats:false})
            }else{
                return res.status(HttpStatus.OK).json({message:SuccessMessages.OTP_VERIFIED,status:true})
            }
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body
            const newOtp = await this.otpService.generateAndSaveOtp(email)
            await this.emailService.sendVerificationEmail(email,newOtp)
            res.status(HttpStatus.OK).json({message:SuccessMessages.OTP_CREATED})
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }
}