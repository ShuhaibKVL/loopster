export interface IEmailService {
    sendVerificationEmail(email:string,otp:Number):Promise<void>
}