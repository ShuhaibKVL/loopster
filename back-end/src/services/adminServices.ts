import { fetchUsers } from "../repositories/adminRepository"

export interface Iadmin {
    email:string,
    password:string
}

export const adminSignIn = async(formData:Iadmin):Promise<boolean> => {
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
}

export const getAllUsers = async():Promise<any> => {
    return await fetchUsers()
}