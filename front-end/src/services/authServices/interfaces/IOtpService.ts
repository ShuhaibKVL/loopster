export interface IOtpService {
    verifyOtp(email:string,otp:string):Promise<unknown>
    resendOtp(email:string):Promise<unknown>
}