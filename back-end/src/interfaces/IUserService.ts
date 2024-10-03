export interface IUserService {
    createUser(userData:any):Promise<any>
    findUserByEmail(email:string):Promise<any>
}