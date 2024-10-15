export interface IOtpService {
    verifyOtp(email:string,otp:number):Promise<any>
    generateAndSaveOtp(email:string):Promise<any>
}