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
            console.log('otp body :',email,"<>",otp)
           
            if(!email && !otp){
                res.status(HttpStatus.OK).json({message:'Otp and email missing',stats:false})
                return
            }
            const isVerified = await this.otpService.verifyOtp(email,otp)
            console.log('is verified Otp :',isVerified)
            if(!isVerified){
                res.status(HttpStatus.OK).json({message:ErrorMessages.INVALID_OTP ,stats:false})
                return
            }
            
            const user = await this.userService.findUserByEmail(email)
            console.log('user :',user)
            if(!user){
                res.status(HttpStatus.OK).json({message:'User email not found. try again',stats:false})
                return
            }
            //Update user isVerified field to " true "
            await this.userService.verifyUser(user?._id)

            return res.status(HttpStatus.OK).json({message:SuccessMessages.OTP_VERIFIED,status:true})
            
        } catch (error:any) {
            console.log('otp error :',error)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body
            if(!email ){
                res.status(HttpStatus.OK).json({message:'email missing',stats:false})
                return
            }
            console.log('email on resend otp :',email)
            const newOtp = await this.otpService.generateAndSaveOtp(email)
            if(!newOtp ){
                res.status(HttpStatus.OK).json({message:'Otp creation failed',stats:false})
                return
            }
            await this.emailService.sendVerificationEmail(email,newOtp)
            res.status(HttpStatus.OK).json({message:SuccessMessages.OTP_SEND,stats:true})
        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }
}