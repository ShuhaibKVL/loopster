import { IsignIn } from "@/app/admin/(auth)/signIn/page"
import { IAdminAuthService } from "./interfaces/IAdminAuthServices";

export const signIn = async(formData:IsignIn):Promise<any> => {
    try {
        const response = await fetch('http://localhost:5000/api/admin/signIn',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        });

        const res = await response.json()
        console.log("admin sign In response :",res)
        return res
    } catch (error) {
        
    }
}

export class AdminAuthService implements IAdminAuthService {

    async signIn(formData: { [key: string]: any; }): Promise<any> {
        try {
            const response = await fetch('http://localhost:5000/api/admin/signIn',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            });
            
            const res = await response.json()
            console.log("admin sign In response :",res)
            return res
        } catch (error) {
            console.log(error)
        }
    }
}

const adminAuthService = new AdminAuthService
export default adminAuthService