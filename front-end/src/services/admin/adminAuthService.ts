import { IsignIn } from "@/app/admin/(auth)/signIn/page"
import { IAdminAuthService, IAdminAuthServiceResponse } from "./interfaces/IAdminAuthServices";
import { adminApi } from "../apis/axiosInstance";

export const signIn = async(formData:IsignIn):Promise<unknown> => {
    try {
        const response = await fetch(`${adminApi}/signIn`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        });

        const res = await response.json()
        return res
    } catch (error:unknown) {
        console.log(error)
    }
}

export class AdminAuthService implements IAdminAuthService {

    async signIn(formData: IsignIn): Promise<IAdminAuthServiceResponse> {
        try {
            const response = await fetch(`${adminApi}/signIn`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            });
            
            const res = await response.json()
            return res
        } catch {
            return {status:false}
        }
    }
}

const adminAuthService = new AdminAuthService
export default adminAuthService