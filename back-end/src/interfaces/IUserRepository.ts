export interface IUserRepository {
    create(userData:any):Promise<any>
    findByEmail(email:string):Promise<any>
}