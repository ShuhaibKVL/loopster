export interface IOtpRepository {
    create(email:string,otp:number):Promise<void>
    isExist(email:string,otp:number):Promise<any>
}