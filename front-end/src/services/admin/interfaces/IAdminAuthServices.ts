
export interface IAdminAuthService {
    signIn(formData:{ [key: string]: any}):Promise<any>
}