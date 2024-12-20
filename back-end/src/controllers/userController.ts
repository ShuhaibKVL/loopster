import { IUser } from "../models/userModel"
import { NextFunction, Request,Response } from "express"
import { signInSchema, signUpSchema } from "../utils/validationSchemas"
import { ValidationError } from "yup"
import { IUserController } from "../interfaces/IUserController"
import { IUserService } from "../interfaces/IUserService"
import { IAuthService } from "../interfaces/IAuthService"
import { IEmailService } from "../interfaces/IEmailService"
import { SuccessMessages } from "../enums/successMessages"
import { ErrorMessages } from "../enums/errorMessages"
import { HttpStatus } from "../enums/httpStatus"
import { generateOtp } from "../utils/otpGenerator"
import { IOtpService } from "../interfaces/IOtpService"
import { IFollowService } from "../interfaces/follow/IFollowService"
import { IMessageService } from "../interfaces/message/IMessageService"

export class UserController{
    constructor(
        private userService:IUserService,
        private authService:IAuthService,
        private emailService:IEmailService,
        private otpService : IOtpService,
        private followService : IFollowService,
        private messageService :IMessageService
    ){}

    async signUp(req: Request, res: Response): Promise<void> {
        try {
            console.log('signup data :',req?.body)
            const userData : IUser = req.body
            //Validate the form
            await signUpSchema.validate(userData , {abortEarly:false})

            const isExistUserEmail = await this.userService.findUserByEmail(userData.email)
            console.log('isExistUserEmail :',isExistUserEmail)
            if(isExistUserEmail){
                res.status(HttpStatus.OK).json({message:ErrorMessages.EMAIL_ALREADY_EXIST , status:false})
                return;
            }
            const isExistUserName = await this.userService.findUserByUserName(userData.userName)
            if(isExistUserName){
                res.status(HttpStatus.OK).json({message:ErrorMessages.USERNAME_ALREADY_EXIST ,status:false})
                return;
            }
            const newUser = await this.userService.createUser(userData)
            const otp = await this.otpService.generateAndSaveOtp(userData.email)
            const emailSend = await this.emailService.sendVerificationEmail(userData.email,otp)
            res.status(HttpStatus.CREATED).json({
                message:SuccessMessages.EMAIL_SENT+ ', Please check your email.',
                status:true,user:userData.email})
        } catch (error) {

            if (error instanceof ValidationError) {
                const validationErrors = error.inner.map((err) => ({
                    path: err.path,
                    message: err.message
                }));
                res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    errors: validationErrors
                });
            }
        }
    }

    async signIn(req: Request, res: Response): Promise<void> {
        try {
            const userData  = req.body
            //validate the form
            await signInSchema.validate(userData ,{abortEarly:true})
            const isExistUser = await this.userService.findUserByEmail(userData.email)
            if(!isExistUser){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:ErrorMessages.USER_NOT_FOUND ,status:false})
                return;
            }
            const isPasswordMatch = await this.authService.verifyPassword(userData.password , isExistUser.password)
            if(!isPasswordMatch){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:ErrorMessages.PASSWORD_NOT_MATCH ,status:false})
                return
            }

            if(isExistUser?.isBlocked){
                console.log('admin blocked ',userData?.email)
                res.status(HttpStatus.FORBIDDEN).json({message:ErrorMessages.BLOCKED,status:false})
            }   

            const token = this.authService.generateToken(isExistUser._id,'1h')

            const totalUnReadMessages = await this.messageService.totalUnReadMessages(isExistUser?._id.toString())
            console.log('total unread messages :',totalUnReadMessages)

            res.cookie('accessToken', token, {
                httpOnly: true,      // Helps prevent XSS attacks
                secure: process.env.NODE_ENV==='production', // Only send over HTTPS in production
                maxAge: 60 * 60 * 1000, // 1 hour
                sameSite: 'strict', // CSRF protection
            });

            res.status(HttpStatus.OK).json({
                message:SuccessMessages.LOGIN_SUCCESSFUL,
                accessToken:token,
                userData:{
                    _id:isExistUser._id,
                    firstName:isExistUser.fullName,
                    userName:isExistUser.userName,
                    profileImg:isExistUser?.profileImage
                },
                totalUnReadMessages:totalUnReadMessages,
                status:true
            })

        } catch (error) {
            if(error instanceof ValidationError) {
                const validationErrors = error.inner.map((err:any) => err.message).join(', ')
                res.status(HttpStatus.BAD_REQUEST).json({
                success:false,
                errors:error.errors
                })
            }
        }
    }

    async signInWithGoogle(req:Request,res:Response):Promise<unknown>{
        try {
            console.log('signup data in sign with google :',req?.body)
            const userData : IUser = req.body
            let newUser ;
            const isExistUserEmail = await this.userService.findUserByEmail(userData.email)
            console.log('isExistUserEmail :',isExistUserEmail)
            if(isExistUserEmail){
                newUser = isExistUserEmail
            }else{
                newUser = await this.userService.createUser(userData)
                console.log('new user :',newUser)
            }

            const token = this.authService.generateToken(newUser._id,'1h')

            const totalUnReadMessages = await this.messageService.totalUnReadMessages(newUser?._id.toString())
            console.log('total unread messages :',totalUnReadMessages)

            res.status(HttpStatus.OK).json({
                message:SuccessMessages.LOGIN_SUCCESSFUL,
                accessToken:token,
                userData:{
                    _id:newUser?._id,
                    firstName:newUser?.fullName,
                    userName:newUser?.userName,
                    profileImg:newUser?.profileImage
                },
                totalUnReadMessages:totalUnReadMessages,
                status:true
            })
            return

        } catch (error:any) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    logout(req: Request, res: Response): Promise<void> {
        return Promise.resolve()
    }

    async getUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId

        if(!userId){
            res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId missng..!',status:false})
            return
        }
        try {
            const user = await this.userService.findUserById(userId)
            if(!user){
                res.status(HttpStatus.NOT_FOUND).json({
                    message:ErrorMessages.USER_NOT_FOUND,
                    status:false
                })
            }
            res.status(HttpStatus.OK).json({
                message:SuccessMessages.USER_FETCHED,
                userData:user,
                status:true
            })
        } catch (error:any) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message)
        }
    }

    async uploadProfileImage(req: Request, res: Response): Promise<void> {
        try {
            console.log('upload profile function invoked')
            const userId = req.params.userId
            const file = req.file?.buffer;
            const fileName = `profile-images/${userId}-${Date.now()}.jpeg`; // Customize file name as needed
            console.log(userId,"<>",file,"<>",fileName)

            if (!file) {
                console.log('else')
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'No file uploaded' });
                return;
            }
            console.log('file :',file)
            const updateUser = await this.userService.uploadProfileImage(userId,file,fileName)

            res.status(HttpStatus.OK).json({data :updateUser,status:true})

        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to update image url',status:false})
        }
    }

    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId
            const formData  = req.body

            if(!userId && formData){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId missng..!',status:false})
                
            }

            const updateProfile = await this.userService.updateProfile(userId,formData)
            res.status(HttpStatus.OK).json({data:updateProfile,status:true})

        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to update profile',status:false})
        }
    }

    // to get latest users on feed recommended section
    async getLatestUsers(req:Request , res:Response) {
        try {
            const { userId } = req.body
            if(!userId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId missng..!',status:false})
                return false
            }
            const latestUsers = await this.userService.findLatestUsers(userId)
            if(latestUsers){
                res.status(HttpStatus.OK).json({data:latestUsers,status:true})
            }
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to fetch latest users',status:false})
        }
    }

    async search_followed_users(req:Request,res:Response):Promise<unknown>{
        try {
            const { userId } = req.params
            const {query } = req.query

            if(!userId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId missng..!',status:false})
                return false
            }
            if(!query){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'query missng..!',status:false})
                return false
            }
            const searchusers = await this.userService.findFollowedUsersBySearch(userId,query as string)
            if(!searchusers){
                res.status(HttpStatus.BAD_REQUEST).json({message:'failed to fetch latest users',status:false})
                return
            }
            res.status(HttpStatus.OK).json({message:'users searched successfully',status:true,users:searchusers})
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to fetch latest users',status:false})
        }
    }

    // handle private account 
    async handlePrivateAccount(req: Request, res: Response): Promise<unknown> {
        try {
            const userId = req.params.userId
            if(!userId){
                res.status(HttpStatus.INVALIDE_CREDENTIAL).json({message:'userId missng..!',status:false})
                return
            }
            const updateIsPrivateAccount = await this.userService.updateIsPrivateAccount(userId)
            if(!updateIsPrivateAccount){
                res.status(HttpStatus.BAD_REQUEST).json({message:'failed to update the account privacy settings',status:false})
                return
            }
            res.status(HttpStatus.OK).json({status:true,message:'Account privacy update successfully.'})
            return

        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({message:'failed to update profile',status:false})
        }
    }
}



