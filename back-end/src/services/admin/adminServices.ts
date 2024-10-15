import { IAdminRepository } from "../../interfaces/admin/IAdminRepository"
import { IAdminService } from "../../interfaces/admin/IAdminService"
import { fetchUsers } from "../../repositories/admin/adminRepository"

export interface IAdmin {
    email:string,
    password:string
}

// export const adminSignIn = async(formData:IAdmin):Promise<boolean> => {
//     console.log(">;l;l",formData)
//     const email = process.env.ADMIN_EMAIL
//     const password = process.env.ADMIN_PASSWORD
//     console.log('env :',email ,password,formData.email === process.env.ADMIN_EMAIL,formData.password === process.env.ADMIN_PASSWORD)
//     if(formData.email === process.env.ADMIN_EMAIL){
//         console.log('email matched')
//         if(formData.password === process.env.ADMIN_PASSWORD){
//             console.log('password matched')
//             return true
//         }else return false
//     }else return false
// }

export const getAllUsers = async():Promise<any> => {
    return await fetchUsers()
}

export class AdminService implements IAdminService {
    constructor(
        private adminRepository : IAdminRepository
    ){}

    async signIn(formData: IAdmin): Promise<any> {
        console.log(">;l;l",formData)
        const email = process.env.ADMIN_EMAIL
        const password = process.env.ADMIN_PASSWORD
        console.log('env :',email ,password,formData.email === process.env.ADMIN_EMAIL,formData.password === process.env.ADMIN_PASSWORD)
        if(formData.email === process.env.ADMIN_EMAIL){
            console.log('email matched')
            if(formData.password === process.env.ADMIN_PASSWORD){
                console.log('password matched')
                return true
            }else return false
        }else return false
            return ''
        }
}

