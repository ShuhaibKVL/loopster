export interface IUserManagementRepository {
    findAllUsers(page:number):Promise<any>
    updateIsBlock(userId:string):Promise<any>
    updateIsList(userId:string):Promise<any>
}