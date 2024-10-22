export interface IOtpService {
    verifyOtp(email:string,otp:string):Promise<any>
    resendOtp(email:string):Promise<any>
}