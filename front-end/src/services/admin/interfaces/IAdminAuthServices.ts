import { IsignIn } from "@/app/(auth)/signIn/page";

export interface IAdminAuthServiceResponse{
    message?:string,
    status?:boolean,
    email?:string,
    accessToken?:string
}
export interface IAdminAuthService {
    signIn(formData:IsignIn):Promise<IAdminAuthServiceResponse>
}