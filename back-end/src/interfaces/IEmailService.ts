export interface IEmailService {
    sendVerificationEmail(email:string,token:string):Promise<void>
}