export interface IUserManagementService {
    getAllUsers(page:number):Promise<any>
    blockUnBlock(userId:string):Promise<any>
    listUnList(userId:string):Promise<any>
    getTotalAccountsCount():Promise<unknown>
    findUsersBasedOnDays():Promise<unknown>
    findById(_id:string):Promise<unknown>
}